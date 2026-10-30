/* Generado por scripts/generar_ut02_autocorregibles.py. No editar a mano. */
window.UT02_PRACTICA = {
 "circuitos": [
  {
   "id": "v1",
   "titulo": "Circuito 5.1",
   "nivel": 1,
   "entradas": [
    "A",
    "B"
   ],
   "valores": {
    "A": 1,
    "B": 1
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "AND",
     "ins": [
      "A",
      "B"
     ]
    },
    {
     "id": "G2",
     "tipo": "NOT",
     "ins": [
      "G1"
     ]
    }
   ],
   "salida": "G2",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 320 130\" role=\"img\" aria-labelledby=\"t-v1 d-v1\">\n<title id=\"t-v1\">Circuito 5.1</title>\n<desc id=\"d-v1\">Circuito combinacional con entradas A, B y salida F. Puerta 1: AND de A y B; Puerta 2: NOT de la salida de la puerta 1. F es la salida de la puerta 2. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L90,40\"/>\n<path class=\"wire\" d=\"M90,40 L90,50\"/>\n<path class=\"wire\" d=\"M90,50 L120,50\"/>\n<path class=\"wire\" d=\"M30,100 L100,100\"/>\n<path class=\"wire\" d=\"M100,100 L100,70\"/>\n<path class=\"wire\" d=\"M100,70 L120,70\"/>\n<path class=\"wire\" d=\"M170,60 L200,60\"/>\n<path class=\"wire\" d=\"M240,60 L270,60\"/>\n<path class=\"gate\" d=\"M120,42 H145 A25,18 0 0 1 145,78 H120 Z\"/>\n<path class=\"gate\" d=\"M200,47 L230,60 L200,73 Z\"/>\n<circle class=\"gate\" cx=\"234\" cy=\"60\" r=\"4\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"100\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"105\" text-anchor=\"end\">B</text>\n<text class=\"dato\" x=\"278\" y=\"65\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"145\" cy=\"28\" r=\"9\"/><text x=\"145\" y=\"32\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"216\" cy=\"34\" r=\"9\"/><text x=\"216\" y=\"38\" text-anchor=\"middle\">2</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"94\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-1.svg"
  },
  {
   "id": "v2",
   "titulo": "Circuito 5.2",
   "nivel": 1,
   "entradas": [
    "A",
    "B"
   ],
   "valores": {
    "A": 1,
    "B": 0
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "OR",
     "ins": [
      "A",
      "B"
     ]
    },
    {
     "id": "G2",
     "tipo": "NOT",
     "ins": [
      "B"
     ]
    },
    {
     "id": "G3",
     "tipo": "AND",
     "ins": [
      "G1",
      "G2"
     ]
    }
   ],
   "salida": "G3",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 370 160\" role=\"img\" aria-labelledby=\"t-v2 d-v2\">\n<title id=\"t-v2\">Circuito 5.2</title>\n<desc id=\"d-v2\">Circuito combinacional con entradas A, B y salida F. Puerta 1: OR de A y B; Puerta 2: NOT de B; Puerta 3: AND de la salida de la puerta 1 y la salida de la puerta 2. F es la salida de la puerta 3. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L130,40\"/>\n<path class=\"wire\" d=\"M30,110 L100,110\"/>\n<path class=\"wire\" d=\"M100,60 L100,130\"/>\n<path class=\"wire\" d=\"M100,60 L130,60\"/>\n<path class=\"wire\" d=\"M100,130 L130,130\"/>\n<path class=\"wire\" d=\"M180,50 L210,50\"/>\n<path class=\"wire\" d=\"M210,50 L210,80\"/>\n<path class=\"wire\" d=\"M210,80 L240,80\"/>\n<path class=\"wire\" d=\"M170,130 L220,130\"/>\n<path class=\"wire\" d=\"M220,130 L220,100\"/>\n<path class=\"wire\" d=\"M220,100 L240,100\"/>\n<path class=\"wire\" d=\"M290,90 L320,90\"/>\n<path class=\"gate\" d=\"M126,32 Q138,50 126,68 Q158,68 180,50 Q158,32 126,32 Z\"/>\n<path class=\"wire\" d=\"M130,40 h4\"/>\n<path class=\"wire\" d=\"M130,60 h4\"/>\n<path class=\"gate\" d=\"M130,117 L160,130 L130,143 Z\"/>\n<circle class=\"gate\" cx=\"164\" cy=\"130\" r=\"4\"/>\n<path class=\"gate\" d=\"M240,72 H265 A25,18 0 0 1 265,108 H240 Z\"/>\n<circle class=\"node\" cx=\"100\" cy=\"110\" r=\"3.6\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"110\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"115\" text-anchor=\"end\">B</text>\n<text class=\"dato\" x=\"328\" y=\"95\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"155\" cy=\"18\" r=\"9\"/><text x=\"155\" y=\"22\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"146\" cy=\"104\" r=\"9\"/><text x=\"146\" y=\"108\" text-anchor=\"middle\">2</text></g>\n<g class=\"puerta-num\" data-g=\"G3\"><circle cx=\"265\" cy=\"58\" r=\"9\"/><text x=\"265\" y=\"62\" text-anchor=\"middle\">3</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"104\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-2.svg"
  },
  {
   "id": "v3",
   "titulo": "Circuito 5.3",
   "nivel": 2,
   "entradas": [
    "A",
    "B",
    "C"
   ],
   "valores": {
    "A": 0,
    "B": 1,
    "C": 1
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "AND",
     "ins": [
      "A",
      "B"
     ]
    },
    {
     "id": "G2",
     "tipo": "NOT",
     "ins": [
      "C"
     ]
    },
    {
     "id": "G3",
     "tipo": "OR",
     "ins": [
      "G1",
      "G2"
     ]
    }
   ],
   "salida": "G3",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 380 170\" role=\"img\" aria-labelledby=\"t-v3 d-v3\">\n<title id=\"t-v3\">Circuito 5.3</title>\n<desc id=\"d-v3\">Circuito combinacional con entradas A, B, C y salida F. Puerta 1: AND de A y B; Puerta 2: NOT de C; Puerta 3: OR de la salida de la puerta 1 y la salida de la puerta 2. F es la salida de la puerta 3. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L140,40\"/>\n<path class=\"wire\" d=\"M30,90 L110,90\"/>\n<path class=\"wire\" d=\"M110,90 L110,60\"/>\n<path class=\"wire\" d=\"M110,60 L140,60\"/>\n<path class=\"wire\" d=\"M30,140 L140,140\"/>\n<path class=\"wire\" d=\"M190,50 L220,50\"/>\n<path class=\"wire\" d=\"M220,50 L220,85\"/>\n<path class=\"wire\" d=\"M220,85 L250,85\"/>\n<path class=\"wire\" d=\"M180,140 L230,140\"/>\n<path class=\"wire\" d=\"M230,140 L230,105\"/>\n<path class=\"wire\" d=\"M230,105 L250,105\"/>\n<path class=\"wire\" d=\"M300,95 L330,95\"/>\n<path class=\"gate\" d=\"M140,32 H165 A25,18 0 0 1 165,68 H140 Z\"/>\n<path class=\"gate\" d=\"M140,127 L170,140 L140,153 Z\"/>\n<circle class=\"gate\" cx=\"174\" cy=\"140\" r=\"4\"/>\n<path class=\"gate\" d=\"M246,77 Q258,95 246,113 Q278,113 300,95 Q278,77 246,77 Z\"/>\n<path class=\"wire\" d=\"M250,85 h4\"/>\n<path class=\"wire\" d=\"M250,105 h4\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"90\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"95\" text-anchor=\"end\">B</text>\n<circle class=\"open\" cx=\"30\" cy=\"140\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"145\" text-anchor=\"end\">C</text>\n<text class=\"dato\" x=\"338\" y=\"100\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"165\" cy=\"18\" r=\"9\"/><text x=\"165\" y=\"22\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"156\" cy=\"114\" r=\"9\"/><text x=\"156\" y=\"118\" text-anchor=\"middle\">2</text></g>\n<g class=\"puerta-num\" data-g=\"G3\"><circle cx=\"275\" cy=\"63\" r=\"9\"/><text x=\"275\" y=\"67\" text-anchor=\"middle\">3</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"84\"></text>\n<text class=\"valor\" data-in=\"C\" x=\"38\" y=\"134\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-3.svg"
  },
  {
   "id": "v4",
   "titulo": "Circuito 5.4",
   "nivel": 2,
   "entradas": [
    "A",
    "B",
    "C"
   ],
   "valores": {
    "A": 0,
    "B": 0,
    "C": 1
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "NOT",
     "ins": [
      "B"
     ]
    },
    {
     "id": "G2",
     "tipo": "OR",
     "ins": [
      "A",
      "G1"
     ]
    },
    {
     "id": "G3",
     "tipo": "OR",
     "ins": [
      "B",
      "C"
     ]
    },
    {
     "id": "G4",
     "tipo": "AND",
     "ins": [
      "G2",
      "G3"
     ]
    }
   ],
   "salida": "G4",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 440 210\" role=\"img\" aria-labelledby=\"t-v4 d-v4\">\n<title id=\"t-v4\">Circuito 5.4</title>\n<desc id=\"d-v4\">Circuito combinacional con entradas A, B, C y salida F. Puerta 1: NOT de B; Puerta 2: OR de A y la salida de la puerta 1; Puerta 3: OR de B y C; Puerta 4: AND de la salida de la puerta 2 y la salida de la puerta 3. F es la salida de la puerta 4. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L200,40\"/>\n<path class=\"wire\" d=\"M30,110 L70,110\"/>\n<path class=\"wire\" d=\"M70,80 L70,150\"/>\n<path class=\"wire\" d=\"M70,80 L90,80\"/>\n<path class=\"wire\" d=\"M70,150 L200,150\"/>\n<path class=\"wire\" d=\"M30,180 L170,180\"/>\n<path class=\"wire\" d=\"M170,180 L170,170\"/>\n<path class=\"wire\" d=\"M170,170 L200,170\"/>\n<path class=\"wire\" d=\"M130,80 L170,80\"/>\n<path class=\"wire\" d=\"M170,80 L170,60\"/>\n<path class=\"wire\" d=\"M170,60 L200,60\"/>\n<path class=\"wire\" d=\"M250,50 L280,50\"/>\n<path class=\"wire\" d=\"M280,50 L280,95\"/>\n<path class=\"wire\" d=\"M280,95 L310,95\"/>\n<path class=\"wire\" d=\"M250,160 L290,160\"/>\n<path class=\"wire\" d=\"M290,160 L290,115\"/>\n<path class=\"wire\" d=\"M290,115 L310,115\"/>\n<path class=\"wire\" d=\"M360,105 L390,105\"/>\n<path class=\"gate\" d=\"M90,67 L120,80 L90,93 Z\"/>\n<circle class=\"gate\" cx=\"124\" cy=\"80\" r=\"4\"/>\n<path class=\"gate\" d=\"M196,32 Q208,50 196,68 Q228,68 250,50 Q228,32 196,32 Z\"/>\n<path class=\"wire\" d=\"M200,40 h4\"/>\n<path class=\"wire\" d=\"M200,60 h4\"/>\n<path class=\"gate\" d=\"M196,142 Q208,160 196,178 Q228,178 250,160 Q228,142 196,142 Z\"/>\n<path class=\"wire\" d=\"M200,150 h4\"/>\n<path class=\"wire\" d=\"M200,170 h4\"/>\n<path class=\"gate\" d=\"M310,87 H335 A25,18 0 0 1 335,123 H310 Z\"/>\n<circle class=\"node\" cx=\"70\" cy=\"110\" r=\"3.6\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"110\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"115\" text-anchor=\"end\">B</text>\n<circle class=\"open\" cx=\"30\" cy=\"180\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"185\" text-anchor=\"end\">C</text>\n<text class=\"dato\" x=\"398\" y=\"110\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"106\" cy=\"54\" r=\"9\"/><text x=\"106\" y=\"58\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"225\" cy=\"18\" r=\"9\"/><text x=\"225\" y=\"22\" text-anchor=\"middle\">2</text></g>\n<g class=\"puerta-num\" data-g=\"G3\"><circle cx=\"225\" cy=\"128\" r=\"9\"/><text x=\"225\" y=\"132\" text-anchor=\"middle\">3</text></g>\n<g class=\"puerta-num\" data-g=\"G4\"><circle cx=\"335\" cy=\"73\" r=\"9\"/><text x=\"335\" y=\"77\" text-anchor=\"middle\">4</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"104\"></text>\n<text class=\"valor\" data-in=\"C\" x=\"38\" y=\"174\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-4.svg"
  },
  {
   "id": "v5",
   "titulo": "Circuito 5.5",
   "nivel": 3,
   "entradas": [
    "A",
    "B",
    "C"
   ],
   "valores": {
    "A": 1,
    "B": 1,
    "C": 0
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "NAND",
     "ins": [
      "A",
      "B"
     ]
    },
    {
     "id": "G2",
     "tipo": "NOR",
     "ins": [
      "G1",
      "C"
     ]
    }
   ],
   "salida": "G2",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 400 180\" role=\"img\" aria-labelledby=\"t-v5 d-v5\">\n<title id=\"t-v5\">Circuito 5.5</title>\n<desc id=\"d-v5\">Circuito combinacional con entradas A, B, C y salida F. Puerta 1: NAND de A y B; Puerta 2: NOR de la salida de la puerta 1 y C. F es la salida de la puerta 2. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L110,40\"/>\n<path class=\"wire\" d=\"M110,40 L110,50\"/>\n<path class=\"wire\" d=\"M110,50 L140,50\"/>\n<path class=\"wire\" d=\"M30,90 L120,90\"/>\n<path class=\"wire\" d=\"M120,90 L120,70\"/>\n<path class=\"wire\" d=\"M120,70 L140,70\"/>\n<path class=\"wire\" d=\"M30,150 L230,150\"/>\n<path class=\"wire\" d=\"M230,150 L230,100\"/>\n<path class=\"wire\" d=\"M230,100 L260,100\"/>\n<path class=\"wire\" d=\"M198,60 L220,60\"/>\n<path class=\"wire\" d=\"M220,60 L220,80\"/>\n<path class=\"wire\" d=\"M220,80 L260,80\"/>\n<path class=\"wire\" d=\"M318,90 L350,90\"/>\n<path class=\"gate\" d=\"M140,42 H165 A25,18 0 0 1 165,78 H140 Z\"/>\n<circle class=\"gate\" cx=\"194\" cy=\"60\" r=\"4\"/>\n<path class=\"gate\" d=\"M256,72 Q268,90 256,108 Q288,108 310,90 Q288,72 256,72 Z\"/>\n<circle class=\"gate\" cx=\"314\" cy=\"90\" r=\"4\"/>\n<path class=\"wire\" d=\"M260,80 h4\"/>\n<path class=\"wire\" d=\"M260,100 h4\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"90\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"95\" text-anchor=\"end\">B</text>\n<circle class=\"open\" cx=\"30\" cy=\"150\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"155\" text-anchor=\"end\">C</text>\n<text class=\"dato\" x=\"358\" y=\"95\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"169\" cy=\"28\" r=\"9\"/><text x=\"169\" y=\"32\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"289\" cy=\"58\" r=\"9\"/><text x=\"289\" y=\"62\" text-anchor=\"middle\">2</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"84\"></text>\n<text class=\"valor\" data-in=\"C\" x=\"38\" y=\"144\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-5.svg"
  },
  {
   "id": "v6",
   "titulo": "Circuito 5.6",
   "nivel": 3,
   "entradas": [
    "A",
    "B",
    "C"
   ],
   "valores": {
    "A": 0,
    "B": 1,
    "C": 0
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "XOR",
     "ins": [
      "A",
      "B"
     ]
    },
    {
     "id": "G2",
     "tipo": "OR",
     "ins": [
      "B",
      "C"
     ]
    },
    {
     "id": "G3",
     "tipo": "NAND",
     "ins": [
      "G1",
      "G2"
     ]
    }
   ],
   "salida": "G3",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 410 180\" role=\"img\" aria-labelledby=\"t-v6 d-v6\">\n<title id=\"t-v6\">Circuito 5.6</title>\n<desc id=\"d-v6\">Circuito combinacional con entradas A, B, C y salida F. Puerta 1: XOR de A y B; Puerta 2: OR de B y C; Puerta 3: NAND de la salida de la puerta 1 y la salida de la puerta 2. F es la salida de la puerta 3. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L150,40\"/>\n<path class=\"wire\" d=\"M30,100 L110,100\"/>\n<path class=\"wire\" d=\"M110,60 L110,130\"/>\n<path class=\"wire\" d=\"M110,60 L150,60\"/>\n<path class=\"wire\" d=\"M110,130 L150,130\"/>\n<path class=\"wire\" d=\"M30,150 L150,150\"/>\n<path class=\"wire\" d=\"M200,50 L230,50\"/>\n<path class=\"wire\" d=\"M230,50 L230,85\"/>\n<path class=\"wire\" d=\"M230,85 L270,85\"/>\n<path class=\"wire\" d=\"M200,140 L240,140\"/>\n<path class=\"wire\" d=\"M240,140 L240,105\"/>\n<path class=\"wire\" d=\"M240,105 L270,105\"/>\n<path class=\"wire\" d=\"M328,95 L360,95\"/>\n<path class=\"gate\" d=\"M146,32 Q158,50 146,68 Q178,68 200,50 Q178,32 146,32 Z\"/>\n<path class=\"wire\" d=\"M139,32 Q151,50 139,68\"/>\n<path class=\"wire\" d=\"M150,40 h4\"/>\n<path class=\"wire\" d=\"M150,60 h4\"/>\n<path class=\"gate\" d=\"M146,122 Q158,140 146,158 Q178,158 200,140 Q178,122 146,122 Z\"/>\n<path class=\"wire\" d=\"M150,130 h4\"/>\n<path class=\"wire\" d=\"M150,150 h4\"/>\n<path class=\"gate\" d=\"M270,77 H295 A25,18 0 0 1 295,113 H270 Z\"/>\n<circle class=\"gate\" cx=\"324\" cy=\"95\" r=\"4\"/>\n<circle class=\"node\" cx=\"110\" cy=\"100\" r=\"3.6\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"100\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"105\" text-anchor=\"end\">B</text>\n<circle class=\"open\" cx=\"30\" cy=\"150\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"155\" text-anchor=\"end\">C</text>\n<text class=\"dato\" x=\"368\" y=\"100\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"175\" cy=\"18\" r=\"9\"/><text x=\"175\" y=\"22\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"175\" cy=\"108\" r=\"9\"/><text x=\"175\" y=\"112\" text-anchor=\"middle\">2</text></g>\n<g class=\"puerta-num\" data-g=\"G3\"><circle cx=\"299\" cy=\"63\" r=\"9\"/><text x=\"299\" y=\"67\" text-anchor=\"middle\">3</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"94\"></text>\n<text class=\"valor\" data-in=\"C\" x=\"38\" y=\"144\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-6.svg"
  },
  {
   "id": "v7",
   "titulo": "Circuito 5.7",
   "nivel": 4,
   "entradas": [
    "A",
    "B",
    "C"
   ],
   "valores": {
    "A": 1,
    "B": 0,
    "C": 1
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "AND",
     "ins": [
      "A",
      "C"
     ]
    },
    {
     "id": "G2",
     "tipo": "NOT",
     "ins": [
      "B"
     ]
    },
    {
     "id": "G3",
     "tipo": "XOR",
     "ins": [
      "B",
      "C"
     ]
    },
    {
     "id": "G4",
     "tipo": "OR",
     "ins": [
      "G1",
      "G2"
     ]
    },
    {
     "id": "G5",
     "tipo": "AND",
     "ins": [
      "G4",
      "G3"
     ]
    }
   ],
   "salida": "G5",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 540 190\" role=\"img\" aria-labelledby=\"t-v7 d-v7\">\n<title id=\"t-v7\">Circuito 5.7</title>\n<desc id=\"d-v7\">Circuito combinacional con entradas A, B, C y salida F. Puerta 1: AND de A y C; Puerta 2: NOT de B; Puerta 3: XOR de B y C; Puerta 4: OR de la salida de la puerta 1 y la salida de la puerta 2; Puerta 5: AND de la salida de la puerta 4 y la salida de la puerta 3. F es la salida de la puerta 5. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L220,40\"/>\n<path class=\"wire\" d=\"M30,100 L85,100 A5,5 0 0 1 95,100 L130,100\"/>\n<path class=\"wire\" d=\"M110,100 L110,140\"/>\n<path class=\"wire\" d=\"M110,140 L220,140\"/>\n<path class=\"wire\" d=\"M30,160 L90,160\"/>\n<path class=\"wire\" d=\"M90,160 L90,60\"/>\n<path class=\"wire\" d=\"M90,60 L220,60\"/>\n<path class=\"wire\" d=\"M90,160 L220,160\"/>\n<path class=\"wire\" d=\"M270,50 L290,50\"/>\n<path class=\"wire\" d=\"M290,50 L290,70\"/>\n<path class=\"wire\" d=\"M290,70 L310,70\"/>\n<path class=\"wire\" d=\"M170,100 L295,100\"/>\n<path class=\"wire\" d=\"M295,100 L295,90\"/>\n<path class=\"wire\" d=\"M295,90 L310,90\"/>\n<path class=\"wire\" d=\"M270,150 L395,150\"/>\n<path class=\"wire\" d=\"M395,150 L395,125\"/>\n<path class=\"wire\" d=\"M395,125 L410,125\"/>\n<path class=\"wire\" d=\"M360,80 L385,80\"/>\n<path class=\"wire\" d=\"M385,80 L385,105\"/>\n<path class=\"wire\" d=\"M385,105 L410,105\"/>\n<path class=\"wire\" d=\"M460,115 L490,115\"/>\n<path class=\"gate\" d=\"M220,32 H245 A25,18 0 0 1 245,68 H220 Z\"/>\n<path class=\"gate\" d=\"M130,87 L160,100 L130,113 Z\"/>\n<circle class=\"gate\" cx=\"164\" cy=\"100\" r=\"4\"/>\n<path class=\"gate\" d=\"M216,132 Q228,150 216,168 Q248,168 270,150 Q248,132 216,132 Z\"/>\n<path class=\"wire\" d=\"M209,132 Q221,150 209,168\"/>\n<path class=\"wire\" d=\"M220,140 h4\"/>\n<path class=\"wire\" d=\"M220,160 h4\"/>\n<path class=\"gate\" d=\"M306,62 Q318,80 306,98 Q338,98 360,80 Q338,62 306,62 Z\"/>\n<path class=\"wire\" d=\"M310,70 h4\"/>\n<path class=\"wire\" d=\"M310,90 h4\"/>\n<path class=\"gate\" d=\"M410,97 H435 A25,18 0 0 1 435,133 H410 Z\"/>\n<circle class=\"node\" cx=\"90\" cy=\"160\" r=\"3.6\"/>\n<circle class=\"node\" cx=\"110\" cy=\"100\" r=\"3.6\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"100\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"105\" text-anchor=\"end\">B</text>\n<circle class=\"open\" cx=\"30\" cy=\"160\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"165\" text-anchor=\"end\">C</text>\n<text class=\"dato\" x=\"498\" y=\"120\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"245\" cy=\"18\" r=\"9\"/><text x=\"245\" y=\"22\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"146\" cy=\"74\" r=\"9\"/><text x=\"146\" y=\"78\" text-anchor=\"middle\">2</text></g>\n<g class=\"puerta-num\" data-g=\"G3\"><circle cx=\"245\" cy=\"118\" r=\"9\"/><text x=\"245\" y=\"122\" text-anchor=\"middle\">3</text></g>\n<g class=\"puerta-num\" data-g=\"G4\"><circle cx=\"335\" cy=\"48\" r=\"9\"/><text x=\"335\" y=\"52\" text-anchor=\"middle\">4</text></g>\n<g class=\"puerta-num\" data-g=\"G5\"><circle cx=\"435\" cy=\"83\" r=\"9\"/><text x=\"435\" y=\"87\" text-anchor=\"middle\">5</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"94\"></text>\n<text class=\"valor\" data-in=\"C\" x=\"38\" y=\"154\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-7.svg"
  },
  {
   "id": "v8",
   "titulo": "Circuito 5.8",
   "nivel": 4,
   "entradas": [
    "A",
    "B"
   ],
   "valores": {
    "A": 1,
    "B": 0
   },
   "puertas": [
    {
     "id": "G1",
     "tipo": "NAND",
     "ins": [
      "A",
      "B"
     ]
    },
    {
     "id": "G2",
     "tipo": "NAND",
     "ins": [
      "A",
      "G1"
     ]
    },
    {
     "id": "G3",
     "tipo": "NAND",
     "ins": [
      "G1",
      "B"
     ]
    },
    {
     "id": "G4",
     "tipo": "NAND",
     "ins": [
      "G2",
      "G3"
     ]
    }
   ],
   "salida": "G4",
   "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 0 500 190\" role=\"img\" aria-labelledby=\"t-v8 d-v8\">\n<title id=\"t-v8\">Circuito 5.8</title>\n<desc id=\"d-v8\">Circuito combinacional con entradas A, B y salida F. Puerta 1: NAND de A y B; Puerta 2: NAND de A y la salida de la puerta 1; Puerta 3: NAND de la salida de la puerta 1 y B; Puerta 4: NAND de la salida de la puerta 2 y la salida de la puerta 3. F es la salida de la puerta 4. Un cruce con salto indica que los cables no están unidos.</desc>\n<style>.wire{fill:none;stroke:#24364a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.gate{fill:white;stroke:#24364a;stroke-width:2.2;stroke-linejoin:round}.node{fill:#24364a}.open{fill:white;stroke:#24364a;stroke-width:2}text{font:16px sans-serif;fill:#24364a}.dato{font-weight:700;fill:#8a3d00}</style>\n<style>.puerta-num circle{fill:#e8f1f9;stroke:#1f5c8f;stroke-width:1.5}.puerta-num text{font:bold 12px sans-serif;fill:#1f5c8f}.valor{font:bold 15px sans-serif;fill:#b4232c}</style>\n<rect x=\"-10\" width=\"100%\" height=\"100%\" fill=\"white\"/>\n<path class=\"wire\" d=\"M30,40 L250,40\"/>\n<path class=\"wire\" d=\"M80,40 L80,90\"/>\n<path class=\"wire\" d=\"M80,90 L130,90\"/>\n<path class=\"wire\" d=\"M30,160 L250,160\"/>\n<path class=\"wire\" d=\"M100,160 L100,110\"/>\n<path class=\"wire\" d=\"M100,110 L130,110\"/>\n<path class=\"wire\" d=\"M188,100 L210,100\"/>\n<path class=\"wire\" d=\"M210,60 L210,140\"/>\n<path class=\"wire\" d=\"M210,60 L250,60\"/>\n<path class=\"wire\" d=\"M210,140 L250,140\"/>\n<path class=\"wire\" d=\"M308,50 L330,50\"/>\n<path class=\"wire\" d=\"M330,50 L330,90\"/>\n<path class=\"wire\" d=\"M330,90 L360,90\"/>\n<path class=\"wire\" d=\"M308,150 L335,150\"/>\n<path class=\"wire\" d=\"M335,150 L335,110\"/>\n<path class=\"wire\" d=\"M335,110 L360,110\"/>\n<path class=\"wire\" d=\"M418,100 L450,100\"/>\n<path class=\"gate\" d=\"M130,82 H155 A25,18 0 0 1 155,118 H130 Z\"/>\n<circle class=\"gate\" cx=\"184\" cy=\"100\" r=\"4\"/>\n<path class=\"gate\" d=\"M250,32 H275 A25,18 0 0 1 275,68 H250 Z\"/>\n<circle class=\"gate\" cx=\"304\" cy=\"50\" r=\"4\"/>\n<path class=\"gate\" d=\"M250,132 H275 A25,18 0 0 1 275,168 H250 Z\"/>\n<circle class=\"gate\" cx=\"304\" cy=\"150\" r=\"4\"/>\n<path class=\"gate\" d=\"M360,82 H385 A25,18 0 0 1 385,118 H360 Z\"/>\n<circle class=\"gate\" cx=\"414\" cy=\"100\" r=\"4\"/>\n<circle class=\"node\" cx=\"80\" cy=\"40\" r=\"3.6\"/>\n<circle class=\"node\" cx=\"100\" cy=\"160\" r=\"3.6\"/>\n<circle class=\"node\" cx=\"210\" cy=\"100\" r=\"3.6\"/>\n<circle class=\"open\" cx=\"30\" cy=\"40\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"45\" text-anchor=\"end\">A</text>\n<circle class=\"open\" cx=\"30\" cy=\"160\" r=\"4\"/>\n<text class=\"dato\" x=\"22\" y=\"165\" text-anchor=\"end\">B</text>\n<text class=\"dato\" x=\"458\" y=\"105\">F</text>\n<g class=\"puerta-num\" data-g=\"G1\"><circle cx=\"159\" cy=\"68\" r=\"9\"/><text x=\"159\" y=\"72\" text-anchor=\"middle\">1</text></g>\n<g class=\"puerta-num\" data-g=\"G2\"><circle cx=\"279\" cy=\"18\" r=\"9\"/><text x=\"279\" y=\"22\" text-anchor=\"middle\">2</text></g>\n<g class=\"puerta-num\" data-g=\"G3\"><circle cx=\"279\" cy=\"118\" r=\"9\"/><text x=\"279\" y=\"122\" text-anchor=\"middle\">3</text></g>\n<g class=\"puerta-num\" data-g=\"G4\"><circle cx=\"389\" cy=\"68\" r=\"9\"/><text x=\"389\" y=\"72\" text-anchor=\"middle\">4</text></g>\n<text class=\"valor\" data-in=\"A\" x=\"38\" y=\"34\"></text>\n<text class=\"valor\" data-in=\"B\" x=\"38\" y=\"154\"></text>\n</svg>\n",
   "descarga": "../assets/img/logica/valores-8.svg"
  }
 ],
 "programas": [
  {
   "id": 1,
   "titulo": "Programa 6.1",
   "nivel": 1,
   "inicio": 200,
   "memoria": {
    "200": 1210,
    "201": 3211,
    "202": 2212,
    "210": 8,
    "211": 5
   }
  },
  {
   "id": 2,
   "titulo": "Programa 6.2",
   "nivel": 1,
   "inicio": 300,
   "memoria": {
    "300": 1320,
    "301": 4321,
    "302": 5322,
    "303": 2323,
    "320": 20,
    "321": 6,
    "322": 3
   }
  },
  {
   "id": 3,
   "titulo": "Programa 6.3",
   "nivel": 2,
   "inicio": 150,
   "memoria": {
    "150": 1170,
    "151": 3171,
    "152": 3172,
    "153": 6173,
    "154": 2174,
    "170": 7,
    "171": 8,
    "172": 9,
    "173": 3
   }
  },
  {
   "id": 4,
   "titulo": "Programa 6.4",
   "nivel": 2,
   "inicio": 400,
   "memoria": {
    "400": 1450,
    "401": 6451,
    "402": 2452,
    "403": 5451,
    "404": 2453,
    "450": 17,
    "451": 5
   }
  },
  {
   "id": 5,
   "titulo": "Programa 6.5",
   "nivel": 3,
   "inicio": 120,
   "memoria": {
    "120": 1140,
    "121": 3140,
    "122": 2140,
    "123": 3140,
    "124": 2141,
    "140": 6
   }
  },
  {
   "id": 6,
   "titulo": "Programa 6.6",
   "nivel": 3,
   "inicio": 500,
   "memoria": {
    "500": 1520,
    "501": 4521,
    "502": 2522,
    "503": 4521,
    "504": 3520,
    "505": 2523,
    "520": 4,
    "521": 10
   }
  }
 ]
};
