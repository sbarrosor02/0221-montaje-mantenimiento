from pathlib import Path
from html import escape
import json
import math

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'web/assets/img/circuitos'


class Circuit:
    def __init__(self, name, title, description, width, height, value, current=None):
        self.name = name
        self.title = title
        self.description = description
        self.width = width
        self.height = height
        self.value = value
        self.current = current
        self.elements = []
        self.wires = []
        self.resistors = []
        self.terminals = None

    def wire(self, *points):
        self.elements.append('<polyline class="wire" points="' + ' '.join(f'{point[0]},{point[1]}' for point in points) + '"/>')
        self.wires.extend(zip(points, points[1:]))

    def text(self, x, y, label, anchor='middle'):
        self.elements.append(f'<text x="{x}" y="{y}" text-anchor="{anchor}">{escape(label)}</text>')

    def resistor(self, start, end, ohms, label):
        xstart, ystart = start
        xend, yend = end
        assert xstart == xend or ystart == yend
        length = math.hypot(xend - xstart, yend - ystart)
        assert length >= 80
        horizontal = ystart == yend
        center_x, center_y = (xstart + xend) / 2, (ystart + yend) / 2
        angle = math.degrees(math.atan2(yend - ystart, xend - xstart))
        half = length / 2
        shape = f'M{-half},0 H-30 L-25,-9 L-15,9 L-5,-9 L5,9 L15,-9 L25,9 L30,0 H{half}'
        self.elements.append(f'<path class="wire" transform="translate({center_x},{center_y}) rotate({angle})" d="{shape}"/>')
        if horizontal:
            self.text(center_x, center_y - 20, label)
        else:
            self.text(center_x + 20, center_y + 6, label, 'start')
        self.resistors.append((start, end, ohms))

    def source(self, start, end, label):
        xstart, ystart = start
        xend, yend = end
        assert xstart == xend or ystart == yend
        center_x, center_y = (xstart + xend) / 2, (ystart + yend) / 2
        length = math.hypot(xend - xstart, yend - ystart)
        angle = math.degrees(math.atan2(yend - ystart, xend - xstart))
        self.elements.append(f'<g transform="translate({center_x},{center_y}) rotate({angle})"><path class="wire" d="M{-length/2},0 H-24 M24,0 H{length/2}"/><circle class="source" r="24"/></g>')
        offset_x = 10 * (xend - xstart) / length
        offset_y = 10 * (yend - ystart) / length
        plus_x, plus_y = center_x - offset_x, center_y - offset_y
        minus_x, minus_y = center_x + offset_x, center_y + offset_y
        self.elements.append(f'<path class="wire" d="M{plus_x-5},{plus_y} h10 M{plus_x},{plus_y-5} v10 M{minus_x-5},{minus_y} h10"/>')
        if xstart == xend:
            self.text(center_x - 34, center_y + 6, label, 'end')
        else:
            self.text(center_x, center_y + 49, label)
        self.terminals = (start, end)

    def dot(self, *points):
        for xpos, ypos in points:
            self.elements.append(f'<circle class="node" cx="{xpos}" cy="{ypos}" r="3.5"/>')

    def network(self):
        points = set(self.terminals)
        for start, end in self.wires:
            points.update((start, end))
        for start, end, resistance in self.resistors:
            points.update((start, end))
        parent = {point: point for point in points}

        def root(point):
            while parent[point] != point:
                point = parent[point]
            return point

        for start, end in self.wires:
            for point in points:
                cross = (point[0] - start[0]) * (end[1] - start[1]) - (point[1] - start[1]) * (end[0] - start[0])
                if cross == 0 and min(start[0], end[0]) <= point[0] <= max(start[0], end[0]) and min(start[1], end[1]) <= point[1] <= max(start[1], end[1]):
                    parent[root(point)] = root(start)
        positive, negative = [root(point) for point in self.terminals]
        assert positive != negative, 'Fuente cortocircuitada'
        edges = [(root(start), root(end), resistance) for start, end, resistance in self.resistors]
        assert all(start != end for start, end, _ in edges), 'Resistencia cortocircuitada'
        unknown = sorted(set(parent_point for edge in edges for parent_point in edge[:2]) - {positive, negative})
        matrix = [[0.0] * (len(unknown) + 1) for _ in unknown]
        for start, end, resistance in edges:
            for node, neighbor in [(start, end), (end, start)]:
                if node not in unknown:
                    continue
                row = unknown.index(node)
                matrix[row][row] += 1 / resistance
                if neighbor in unknown:
                    matrix[row][unknown.index(neighbor)] -= 1 / resistance
                elif neighbor == positive:
                    matrix[row][-1] += 1 / resistance
        for column in range(len(unknown)):
            pivot = max(range(column, len(unknown)), key=lambda row: abs(matrix[row][column]))
            matrix[column], matrix[pivot] = matrix[pivot], matrix[column]
            scale = matrix[column][column]
            assert abs(scale) > 1e-12, 'Rama desconectada'
            matrix[column] = [entry / scale for entry in matrix[column]]
            for row in range(len(unknown)):
                if row != column:
                    factor = matrix[row][column]
                    matrix[row] = [entry - factor * pivot_entry for entry, pivot_entry in zip(matrix[row], matrix[column])]
        voltages = {positive: 1.0, negative: 0.0}
        voltages.update({node: matrix[index][-1] for index, node in enumerate(unknown)})
        current = sum((1 - voltages[end]) / resistance if start == positive else (1 - voltages[start]) / resistance if end == positive else 0 for start, end, resistance in edges)
        return 1 / current

    def save(self, expected):
        equivalent = self.network()
        assert math.isclose(equivalent, expected, rel_tol=1e-10), (self.name, equivalent, expected)
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.width} {self.height}" role="img" aria-labelledby="title desc">\n<title id="title">{escape(self.title)}</title>\n<desc id="desc">{escape(self.description)}</desc>\n<style>.wire{{fill:none;stroke:#24364a;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}}.source{{fill:white;stroke:#24364a;stroke-width:2.5}}.node{{fill:#24364a}}text{{font:18px sans-serif;fill:#24364a}}</style>\n<rect width="100%" height="100%" fill="white"/>\n' + '\n'.join(self.elements) + '\n</svg>\n'
        (OUTPUT / (self.name + '.svg')).write_text(svg, encoding='utf-8')
        return {'archivo': self.name, 'resistencias': len(self.resistors), 'R_equivalente_ohm': equivalent, 'I_amperios': self.current if self.current else self.value / equivalent, 'V_voltios': equivalent * self.current if self.current else self.value}


def parallel(*values):
    return 1 / sum(1 / value for value in values)


def generate():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    results = []
    circuit = Circuit('boletin-1-mixto', 'Boletín 1, ejercicio 10: fuente de 45 V', 'La resistencia de 1,5 ohmios está en serie con tres ramas: 6,2 ohmios; 120 ohmios; y 3,3 ohmios en serie con el paralelo de 820 y 430 ohmios.', 800, 410, 45)
    circuit.wire((90, 70), (250, 70))
    circuit.resistor((250, 70), (420, 70), 3.3, '3,3 Ω')
    circuit.wire((420, 70), (690, 70))
    circuit.wire((90, 340), (690, 340))
    circuit.resistor((90, 70), (90, 340), 820, '820 Ω')
    circuit.resistor((250, 70), (250, 340), 430, '430 Ω')
    circuit.resistor((420, 70), (420, 210), 1.5, '1,5 Ω')
    circuit.source((420, 210), (420, 340), '45 V')
    circuit.resistor((560, 70), (560, 340), 6.2, '6,2 Ω')
    circuit.resistor((690, 70), (690, 340), 120, '120 Ω')
    circuit.dot((250, 70), (420, 70), (560, 70), (250, 340), (420, 340), (560, 340))
    results.append(circuit.save(1.5 + parallel(6.2, 120, 3.3 + parallel(820, 430))))

    circuit = Circuit('boletin-2-1', 'Boletín 2, ejercicio 1: intensidad de 60 mA', '1 kiloohmio y 3 kiloohmios en serie con dos ramas: 8,2 más 160 ohmios, y 16 más 75 ohmios más el paralelo de 82 y 150 ohmios. El retorno incluye el paralelo de 51 y 130 ohmios.', 860, 580, None, .06)
    circuit.resistor((100, 70), (380, 70), 3000, '3 kΩ')
    circuit.resistor((100, 70), (100, 230), 1000, '1 kΩ')
    circuit.source((100, 230), (100, 380), '? V')
    circuit.wire((100, 380), (100, 480), (170, 480))
    circuit.resistor((380, 70), (380, 250), 8.2, '8,2 Ω')
    circuit.resistor((380, 250), (380, 430), 160, '160 Ω')
    circuit.wire((380, 430), (380, 480), (650, 480), (650, 430))
    circuit.resistor((380, 70), (650, 70), 16, '16 Ω')
    circuit.resistor((650, 70), (650, 250), 75, '75 Ω')
    circuit.wire((570, 250), (750, 250))
    circuit.resistor((570, 250), (570, 430), 82, '82 Ω')
    circuit.resistor((750, 250), (750, 430), 150, '150 Ω')
    circuit.wire((570, 430), (750, 430))
    circuit.wire((170, 430), (170, 530))
    circuit.wire((340, 430), (340, 530))
    circuit.resistor((170, 430), (340, 430), 51, '51 Ω')
    circuit.resistor((170, 530), (340, 530), 130, '130 Ω')
    circuit.wire((340, 480), (380, 480))
    circuit.dot((380, 70), (380, 480), (650, 250), (650, 430), (170, 480), (340, 480))
    circuit.text(450, 570, 'I total = 60 mA')
    results.append(circuit.save(1000 + 3000 + parallel(8.2 + 160, 16 + 75 + parallel(82, 150)) + parallel(51, 130)))

    circuit = Circuit('boletin-2-2', 'Boletín 2, ejercicio 2: fuente de 110 V', 'En un único lazo: 1 ohmio, el paralelo de 12,5 y 50 ohmios, 1 ohmio y el paralelo de dos resistencias de 20 ohmios.', 760, 410, 110)
    circuit.wire((90, 150), (240, 150))
    circuit.resistor((90, 150), (90, 290), 1, '1 Ω')
    circuit.wire((240, 90), (240, 210))
    circuit.wire((410, 90), (410, 210))
    circuit.resistor((240, 90), (410, 90), 12.5, '12,5 Ω')
    circuit.resistor((240, 210), (410, 210), 50, '50 Ω')
    circuit.resistor((410, 150), (650, 150), 1, '1 Ω')
    circuit.source((650, 150), (650, 290), '110 V')
    circuit.wire((90, 290), (220, 290))
    circuit.wire((220, 260), (220, 360))
    circuit.wire((400, 260), (400, 360))
    circuit.resistor((220, 260), (400, 260), 20, '20 Ω')
    circuit.resistor((220, 360), (400, 360), 20, '20 Ω')
    circuit.wire((400, 290), (650, 290))
    circuit.dot((240, 150), (410, 150), (220, 290), (400, 290))
    results.append(circuit.save(1 + parallel(12.5, 50) + 1 + parallel(20, 20)))

    circuit = Circuit('boletin-2-3', 'Boletín 2, ejercicio 3: fuente de 24 V', 'Dos ramas en paralelo: 4 ohmios en serie con el paralelo de 16, 24 y la serie 10 más 20 más 18 ohmios; y el paralelo de 12 y 4 ohmios en serie con 3 ohmios.', 850, 520, 24)
    circuit.wire((80, 160), (80, 440), (350, 440))
    circuit.wire((500, 440), (760, 440), (760, 160), (710, 160))
    circuit.source((350, 440), (500, 440), '24 V')
    circuit.resistor((80, 160), (320, 160), 4, '4 Ω')
    circuit.wire((320, 70), (320, 240))
    circuit.wire((710, 70), (710, 240))
    circuit.resistor((320, 70), (710, 70), 16, '16 Ω')
    circuit.resistor((320, 160), (450, 160), 10, '10 Ω')
    circuit.resistor((450, 160), (580, 160), 20, '20 Ω')
    circuit.resistor((580, 160), (710, 160), 18, '18 Ω')
    circuit.resistor((320, 240), (710, 240), 24, '24 Ω')
    circuit.wire((80, 350), (200, 350))
    circuit.wire((200, 300), (200, 400))
    circuit.wire((390, 300), (390, 400))
    circuit.resistor((200, 300), (390, 300), 12, '12 Ω')
    circuit.resistor((200, 400), (390, 400), 4, '4 Ω')
    circuit.resistor((390, 350), (760, 350), 3, '3 Ω')
    circuit.dot((80, 350), (760, 350), (320, 160), (710, 160), (200, 350), (390, 350))
    results.append(circuit.save(parallel(4 + parallel(16, 10 + 20 + 18, 24), parallel(12, 4) + 3)))

    circuit = Circuit('boletin-2-4', 'Boletín 2, ejercicio 4: fuente de 21 V', 'El paralelo de dos resistencias de 12 ohmios está en serie con tres ramas en paralelo: 20 más 4 ohmios; 8 ohmios; y 6 ohmios.', 850, 420, 21)
    circuit.wire((80, 190), (180, 190))
    circuit.wire((180, 130), (180, 250))
    circuit.wire((360, 130), (360, 250))
    circuit.resistor((180, 130), (360, 130), 12, '12 Ω')
    circuit.resistor((180, 250), (360, 250), 12, '12 Ω')
    circuit.wire((360, 190), (450, 190))
    circuit.wire((450, 90), (450, 290))
    circuit.wire((750, 90), (750, 290))
    circuit.resistor((450, 90), (600, 90), 20, '20 Ω')
    circuit.resistor((600, 90), (750, 90), 4, '4 Ω')
    circuit.resistor((450, 190), (750, 190), 8, '8 Ω')
    circuit.resistor((450, 290), (750, 290), 6, '6 Ω')
    circuit.wire((750, 190), (800, 190), (800, 350), (500, 350))
    circuit.wire((80, 190), (80, 350), (350, 350))
    circuit.source((350, 350), (500, 350), '21 V')
    circuit.dot((180, 190), (360, 190), (450, 190), (750, 190))
    results.append(circuit.save(parallel(12, 12) + parallel(20 + 4, 8, 6)))

    circuit = Circuit('boletin-2-5', 'Boletín 2, ejercicio 5: fuente de 35 V', '4 ohmios en serie con dos ramas: otra resistencia de 4 ohmios; y 3 ohmios en serie con el paralelo de 20 más 16 ohmios y la asociación del paralelo de 12 y 4 ohmios seguido de 6 ohmios.', 880, 510, 35)
    circuit.wire((70, 210), (70, 440), (350, 440))
    circuit.wire((500, 440), (800, 440), (800, 90))
    circuit.source((350, 440), (500, 440), '35 V')
    circuit.resistor((70, 210), (240, 210), 4, '4 Ω')
    circuit.wire((240, 90), (240, 330), (300, 330))
    circuit.resistor((240, 90), (800, 90), 4, '4 Ω')
    circuit.resistor((240, 210), (430, 210), 20, '20 Ω')
    circuit.resistor((430, 210), (620, 210), 16, '16 Ω')
    circuit.resistor((620, 210), (800, 210), 3, '3 Ω')
    circuit.wire((300, 280), (300, 380))
    circuit.wire((470, 280), (470, 380))
    circuit.resistor((300, 280), (470, 280), 12, '12 Ω')
    circuit.resistor((300, 380), (470, 380), 4, '4 Ω')
    circuit.resistor((470, 330), (620, 330), 6, '6 Ω')
    circuit.wire((620, 330), (620, 210))
    circuit.dot((240, 210), (620, 210), (800, 210), (300, 330), (470, 330))
    results.append(circuit.save(4 + parallel(4, 3 + parallel(20 + 16, parallel(12, 4) + 6))))
    return results


if __name__ == '__main__':
    print(json.dumps(generate(), indent=2, ensure_ascii=True))
