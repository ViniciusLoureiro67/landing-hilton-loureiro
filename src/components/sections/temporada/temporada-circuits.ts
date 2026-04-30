/**
 * Silhuetas dos 6 circuitos únicos da Moto1000GP 2026.
 *
 * Estética: minimapa de jogo de corrida. Os paths são interpretações
 * estilizadas baseadas nos layouts oficiais (Wikimedia Commons /
 * RacingCircuits.info) — não milimetricamente exatos, mas reconhecíveis
 * pra fã da categoria. Renderizados ~260×120px no popover, então alto
 * detalhe é desperdiçado e atrapalha a leitura.
 *
 * Convenção:
 *  - viewBox sempre `0 0 100 60` — facilita render uniforme
 *  - path FECHADO terminando em `Z` pra ser desenhado de volta ao start
 *  - `start`: ponto da linha de chegada, em coords do viewBox
 *  - `startAngle`: rotação da linha de chegada em graus (perpendicular
 *    ao traçado naquele ponto), 0 = horizontal, 90 = vertical
 *  - `length` / `turns`: meta-info exibida no card
 *  - `direction`: sentido oficial (CW = horário, CCW = anti-horário)
 */

export type CircuitDef = {
  id: string;
  name: string;
  short: string;
  city: string;
  state: string;
  /**
   * SVG path data. Sistema de coordenadas é o `viewBox` do circuito (ou
   * `0 0 100 60` se omitido). Pra circuitos importados de SVG oficial,
   * mantém-se o sistema original do arquivo (centroide na origem etc.).
   */
  path: string;
  /**
   * viewBox custom — quando o path veio de fonte externa (Wikimedia)
   * é melhor preservar o sistema original e ajustar tick/start na
   * mesma escala. Default é `0 0 100 60` pros silhuetas estilizadas.
   */
  viewBox?: string;
  /**
   * Transform a aplicar ao `<g>` que contém o path (e o tick/pulso).
   * Necessário pra paths importados de SVGs do Wikimedia/Inkscape, que
   * costumam ter um `matrix(...)` no `<g>` pai pra posicionar o traçado
   * dentro do canvas original.
   */
  transform?: string;
  /** Linha de chegada (mesmo sistema de coords do path). */
  start: { x: number; y: number; angle: number };
  /** Tamanho do tick da linha de chegada (default 4 pra viewBox 100×60). */
  startTickSize?: number;
  /** Espessura do traço da pista (default 1 pra viewBox 100×60). */
  strokeWidth?: number;
  /** Comprimento oficial em km. */
  length: number;
  /** Nº total de curvas. */
  turns: number;
  direction: "CW" | "CCW";
};

export const CIRCUITS: Record<string, CircuitDef> = {
  // Interlagos — path oficial extraído do SVG da Wikimedia Commons
  // (CC BY-SA). bbox original ≈ [-458, -108] → [363, 790]. Mantemos o
  // sistema de coords original e definimos viewBox com padding.
  // https://commons.wikimedia.org/wiki/File:Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_(AKA_Interlagos)_track_map.svg
  interlagos: {
    id: "interlagos",
    name: "Autódromo José Carlos Pace",
    short: "Interlagos",
    city: "São Paulo",
    state: "SP",
    path: "m -325.53064,789.63076 c 91.43849,-25.57334 183.69198,-49.02808 274.265972,-76.897 14.945786,-4.5987 23.83107,-11.14491 36.855912,-19.59963 11.3258755,-7.35188 18.7430017,-16.11561 25.774482,-26.91395 4.930275,-7.57149 6.488408,-19.34294 5.126466,-28.19556 C 15.2909,630.21622 9.6202119,622.07703 3.6760257,616.23713 -14.730505,598.15352 -35.022623,585.25939 -51.57564,566.25408 c -6.516083,-7.48143 -4.392857,-14.75225 -3.986998,-24.49286 0.448553,-10.76526 6.834531,-21.72649 11.534551,-32.04042 10.679381,-23.43531 28.099525,-51.01509 35.0567702,-75.09786 4.1500995,-14.36573 0.2667615,-30.87561 -1.2816172,-46.1382 -1.44206,-14.21459 -2.794842,-29.03644 -7.6897,-42.29335 -5.358075,-14.51146 -13.837012,-28.42253 -23.0691,-41.01174 -14.264217,-19.45121 -28.464143,-40.7032 -47.419817,-55.10951 -23.764879,-18.06131 -54.088219,-32.10135 -83.460569,-39.12152 -102.09665,-24.40173 -205.8519,-48.89064 -309.99575,-72.37914 -153.46111,-34.61146 -304.64893,-75.654289 -458.28792,-107.811285 -11.68956,-2.446653 -24.98687,-2.196592 -35.88526,1.281617 -9.18028,2.929875 -21.00564,12.509014 -26.16325,20.661354 -8.0858,12.780733 -12.3198,29.419232 -15.3794,44.856584 -6.3389,31.98247 -15.2524,64.39137 -17.8004,96.94975 -1.2968,16.57026 2.4775,34.61424 6.2659,50.43617 3.4741,14.50966 12.2536,28.24037 20.5059,41.01173 9.69037,14.997 18.9315,31.70779 33.322,42.29335 111.63513,82.11805 230.89022,155.84563 344.75489,235.81747 13.8698,9.74133 29.3035,19.83316 38.4485,33.32204 7.94322,11.71625 10.61139,27.86209 12.81617,42.29335 2.49448,16.32754 4.72595,34.03031 1.28161,49.98305 -4.67257,21.64135 -14.39923,43.70294 -25.63233,62.79922 -5.85512,9.9537 -15.23096,19.42375 -25.63233,24.35071 -22.06625,10.45244 -47.43799,16.2411 -71.77054,21.78749 -33.7674,7.69698 -68.40156,14.98927 -102.52933,17.94263 -10.3016,0.89149 -17.84339,0.96187 -26.68072,-3.68936 -5.13761,-2.70401 -10.0105,-7.35804 -13.74709,-12.42736 -1.64287,-2.22883 -3.06608,-4.53794 -4.19555,-6.79689 -2.70971,-5.41943 -2.82031,-13.26179 -1.28161,-19.22425 1.87895,-7.28092 7.36846,-13.86616 11.53455,-20.50587 9.50448,-15.14777 22.54036,-28.84853 29.47718,-44.85658 4.17052,-9.62428 2.07526,-24.89559 -0.23323,-34.75914 -2.39077,-10.21511 -10.52703,-20.12565 -17.94263,-28.19557 -7.10939,-7.73669 -19.21792,-13.00224 -28.80418,-16.05241 -9.21079,-2.93071 -21.35282,-1.91641 -30.7588,1.28162 -11.9543,4.06446 -16.50721,12.71675 -26.07211,21.41211 -18.63067,16.93697 -33.56323,38.19797 -51.26467,56.39113 -13.05735,13.42005 -28.9944,25.62293 -45.08978,34.37042 -23.2075,12.61279 -50.8979,18.49532 -76.897,25.63233 -17.5759,4.82475 -32.5874,8.79682 -48.8436,6.17486 -10.2306,-1.65009 -21.0363,-13.87684 -25.6324,-23.0691 -3.0936,-6.18714 0.2539,-14.46646 3.9227,-20.8035 5.7297,-9.89678 17.3657,-19.08101 26.0854,-27.44482 33.1464,-31.79351 64.9128,-56.27385 93.1693,-91.21467 11.4736,-14.18782 15.5265,-34.55063 19.2242,-52.54629 2.7103,-13.19035 2.7751,-27.83005 0,-41.01173 -4.0602,-19.28594 -13.3905,-38.33784 -25.037,-53.67241 -13.9858,-18.41467 -36.1722,-31.97968 -56.3912,-44.85659 -56.2508,-35.82453 -114.7492,-66.59977 -173.4713,-97.62276 -9.2036,-4.86227 -21.9649,-8.88841 -30.7588,-6.40808 -7.8671,2.21894 -15.3072,12.11218 -19.2243,20.50587 -17.016,36.46289 -26.7969,69.01252 -38.5906,107.7202 -4.8673,15.97463 -8.3303,33.47484 -6.4081,49.98305 5.3403,45.8638 17.8904,92.17791 32.2737,136.22675 12.9579,39.68345 33.9181,73.15602 55.6403,108.62644 12.027,19.6391 28.8393,38.149 47.4198,51.26467 17.7319,12.51667 39.1657,21.39022 60.6114,26.9917 93.0454,24.30291 184.80795,42.53905 279.23695,64.08083 33.95948,7.74706 66.87723,17.1545 101.54535,17.80049 34.11197,0.63563 69.2425,-1.08518 102.52934,-8.97132 121.78878,-28.85354 241.81485,-67.43949 362.69752,-101.24772 z",
    // Canvas original do SVG da Wikimedia (1435×940), com translate do <g>
    // pai. Sem scale — strokeWidth/tick em valores absolutos do canvas.
    viewBox: "0 0 1435 940",
    transform: "translate(1376.5248,-10.338528)",
    start: { x: -325, y: 789, angle: 0 },
    startTickSize: 28,
    strokeWidth: 6,
    length: 4.309,
    turns: 15,
    direction: "CCW",
  },

  // Goiânia (Ayrton Senna) — circuito misto, com Ferradura interna.
  // Path oficial do Wikimedia Commons (CC BY-SA), canvas 1430×885 +
  // translate do <g> pai. 3.835 km, 10 curvas (6 dir + 4 esq).
  // https://commons.wikimedia.org/wiki/File:Aut%C3%B3dromo_Internacional_Ayrton_Senna_(Goi%C3%A2nia)_track_map_(Brazil)--Mixed_circuit.svg
  goiania: {
    id: "goiania",
    name: "Autódromo Internacional Ayrton Senna",
    short: "Goiânia",
    city: "Goiânia",
    state: "GO",
    path: "m -120.47965,934.90965 c -79.18271,43.79499 -151.54925,6.04995 -174.96795,-53.27743 l -18.16276,-46.01233 c -16.94756,-42.93383 -7.64826,-98.37564 16.95191,-137.43157 l 176.1788,-279.70653 c 10.98964,-17.44747 28.434083,-31.4636 47.223176,-39.95808 L 128.956,287.10418 c 39.83678,-18.01006 98.95082,7.34537 111.27249,61.79802 10.45708,46.21253 -18.85918,95.72494 -71.3148,102.87798 L 35.720099,469.94295 c -28.8473503,3.93373 -59.295054,20.55844 -74.467324,45.4069 L -157.41061,709.6914 c -15.19572,24.88688 9.19685,57.91015 30.8767,65.38595 l 17.55734,6.05425 c 31.289204,10.78937 72.439236,-11.63293 91.419233,-38.74722 L -0.6054254,718.16736 C 17.621151,692.12939 43.076073,669.48872 72.045623,656.41397 L 345.6979,532.90719 c 20.94194,-9.45167 41.13835,-23.86773 53.8831,-42.98501 l 47.22295,-70.83497 C 458.17646,402.02832 442.7387,369.86668 425.00863,359.5718 L 406.24044,348.67414 C 387.17599,337.60446 380.42356,304.0541 392.92109,285.89362 l 38.74722,-56.30456 c 19.03411,-27.65894 60.58266,-48.06561 93.84069,-52.67188 l 476.47,-65.9915 c 28.321,-3.92248 65.3332,28.3421 64.1751,56.90999 l -1.8162,44.80148 c -1.6734,41.27773 -31.0516,84.13867 -67.20226,104.13317 z",
    viewBox: "0 0 1430 885",
    transform: "translate(343.24428,-89.584991)",
    start: { x: -120, y: 934, angle: 0 },
    startTickSize: 28,
    strokeWidth: 6,
    length: 3.835,
    turns: 10,
    direction: "CW",
  },

  // Curvelo (Circuito dos Cristais) — Pista de Handling. 4.42 km, 18
  // curvas, desnível 30m. Path vetorizado a partir de arte oficial
  // fornecida pelo cliente (canvas 1024×726pt com transform scale(0.1,-0.1)
  // — sistema de coords interno 10240×7260, Y invertido). Mantemos o
  // sistema original do arquivo, igual fizemos com Interlagos/Goiânia/
  // Cascavel. Tick de chegada posicionado na reta principal (diagonal),
  // sobre o "notch" perpendicular já desenhado na arte original.
  curvelo: {
    id: "curvelo",
    name: "Circuito dos Cristais",
    short: "Curvelo",
    city: "Curvelo",
    state: "MG",
    path: "M5505 5717 c-106 -35 -149 -79 -295 -297 -218 -326 -245 -415 -174 -567 35 -72 95 -130 234 -221 63 -41 176 -119 250 -172 250 -178 572 -392 635 -421 77 -36 146 -46 216 -29 30 7 131 46 224 87 210 93 631 265 704 288 67 22 121 15 166 -20 47 -35 65 -73 65 -136 0 -58 -24 -106 -70 -139 -15 -11 -95 -53 -177 -94 -81 -41 -213 -108 -293 -150 -79 -42 -145 -76 -146 -76 -2 0 -24 35 -49 78 -26 42 -48 78 -50 80 -2 2 -16 -5 -33 -15 l-30 -18 48 -80 47 -80 -66 -36 c-220 -119 -547 -292 -745 -393 -281 -145 -317 -166 -349 -214 -44 -63 -50 -118 -31 -274 20 -159 13 -213 -37 -315 -86 -176 -287 -282 -479 -253 -69 11 -132 40 -395 178 -671 352 -690 361 -821 382 -172 28 -347 -40 -457 -178 -72 -89 -112 -100 -285 -78 -225 30 -1027 99 -1147 100 -116 1 -123 0 -185 -31 -79 -39 -152 -107 -185 -173 -45 -88 -55 -159 -67 -449 -13 -307 -9 -353 41 -425 55 -80 147 -107 377 -109 127 -2 132 -1 187 28 40 21 123 96 294 264 131 129 252 242 268 252 42 26 85 24 278 -13 131 -25 167 -35 167 -47 -1 -9 -7 -44 -14 -79 -10 -47 -11 -64 -2 -67 6 -2 134 -31 285 -65 289 -63 290 -63 291 -13 0 15 -7 24 -22 28 -13 3 -115 26 -228 50 -113 25 -215 48 -228 50 -22 5 -23 9 -17 48 4 23 9 43 10 45 5 6 905 -177 1122 -228 83 -19 92 -24 98 -48 4 -15 6 -138 6 -274 -2 -260 3 -292 47 -342 28 -32 113 -66 164 -66 82 0 80 -1 408 280 132 113 524 448 824 704 204 174 275 235 676 577 190 162 350 298 357 302 7 4 32 -14 63 -47 52 -55 53 -55 76 -38 13 9 24 21 24 26 0 5 -20 33 -45 62 -25 28 -45 54 -45 57 0 2 131 116 291 253 161 137 389 332 508 434 119 102 288 246 376 320 87 74 186 159 219 189 66 58 135 111 146 111 3 0 70 -44 147 -98 188 -132 252 -148 343 -88 148 98 139 529 -16 761 -82 125 -165 172 -326 185 -62 6 -675 11 -1363 13 -929 3 -1260 7 -1287 16 -46 15 -93 53 -116 95 -14 26 -17 55 -14 196 2 150 1 170 -20 225 -27 72 -96 146 -165 177 -58 25 -155 32 -208 15z",
    viewBox: "0 0 1024 726",
    transform: "translate(0,726) scale(0.1,-0.1)",
    start: { x: 6760, y: 3815, angle: 30 },
    startTickSize: 220,
    strokeWidth: 50,
    length: 4.42,
    turns: 18,
    direction: "CCW",
  },

  // Cascavel (Zilmar Beux) — 3.058 km, 14 curvas, "Curva do Bacião".
  // Path oficial do Wikimedia Commons (CC BY-SA), canvas 1444×949 +
  // translate do <g> pai.
  // https://commons.wikimedia.org/wiki/File:Aut%C3%B3dromo_Internacional_de_Cascavel_(Brazil)_track_map.svg
  cascavel: {
    id: "cascavel",
    name: "Autódromo Internacional Zilmar Beux",
    short: "Cascavel",
    city: "Cascavel",
    state: "PR",
    path: "m 503.10851,950.04529 c 40.51368,21.26968 100.74026,24.89336 135.00986,-24.82244 L 930.165,501.54318 c 11.99642,-17.40351 -6.47122,-41.33183 3.71652,-56.01706 l 45.09161,-64.99786 c 11.98352,-17.27379 28.18407,9.3204 42.09687,-10.86308 l 34.7919,-50.47316 c 33.8904,-49.16527 23.6702,-132.20657 -13.9248,-178.60049 l -28.4549,-35.11467 C 941.22538,16.308794 797.69717,64.76232 739.82984,146.04036 L 527.32552,444.51508 C 497.73357,486.0787 489.5598,526.40949 507.34649,583.1575 l 25.42786,81.127 c 17.14616,54.70443 -31.46833,119.81101 -99.28976,99.89519 l -228.8508,-67.20222 c -19.09221,-5.60644 -34.85622,-20.63164 -47.82861,-35.7201 L -99.289766,363.38808 C -132.14911,325.1687 -201.45257,321.87537 -235.51048,362.17723 l -72.65105,85.9704 c -26.80957,31.72465 -24.3015,75.07142 12.10851,93.23551 269.414302,134.40444 532.77435,268.80888 799.16153,408.66215 z",
    viewBox: "0 0 1444 949",
    transform: "translate(347.14749,-36.676705)",
    start: { x: 503, y: 950, angle: 0 },
    startTickSize: 28,
    strokeWidth: 6,
    length: 3.058,
    turns: 14,
    direction: "CW",
  },

  // Santa Cruz do Sul — 3.531km, 14 curvas balanceadas (7 dir + 7 esq).
  // Path vetorizado a partir do "MAPA DE PISTA" oficial (Moto1000GP).
  // Layout: kidney inferior à esquerda + esses centrais (S2) + hairpin
  // alto à direita; reta principal embaixo com SF no centro. Mesmo
  // sistema do Curvelo: canvas 1600×1132pt com transform scale(0.1,-0.1).
  santa_cruz: {
    id: "santa_cruz",
    name: "Autódromo Internacional de Santa Cruz do Sul",
    short: "Santa Cruz do Sul",
    city: "Santa Cruz do Sul",
    state: "RS",
    path: "M11015 9206 c-102 -17 -239 -64 -312 -107 -93 -56 -212 -182 -260 -274 -66 -128 -87 -211 -87 -340 1 -136 10 -181 90 -420 74 -221 91 -324 74 -442 -32 -231 -111 -414 -346 -798 -50 -82 -207 -348 -349 -590 -661 -1127 -801 -1367 -855 -1455 -32 -52 -107 -180 -168 -285 -60 -104 -180 -309 -266 -455 -92 -156 -164 -290 -175 -325 -69 -223 -15 -373 231 -640 101 -110 134 -154 166 -222 37 -79 38 -202 3 -281 -73 -162 -320 -242 -521 -168 -79 29 -549 261 -662 327 -85 50 -139 111 -179 207 -30 70 -33 86 -34 182 0 85 5 120 24 180 25 78 208 447 445 897 l138 262 76 -38 c43 -21 94 -46 114 -54 l38 -16 20 46 c11 25 20 49 20 53 0 4 -47 30 -105 58 -58 28 -105 53 -105 56 0 3 45 92 99 198 163 317 211 472 211 683 0 333 -96 587 -318 842 -120 137 -260 242 -446 332 -225 110 -347 137 -579 128 -298 -11 -545 -94 -812 -272 -253 -169 -280 -201 -579 -690 -136 -224 -232 -329 -443 -489 -187 -141 -419 -217 -750 -248 -200 -18 -420 12 -613 83 -30 11 -161 75 -290 142 -370 192 -436 217 -634 238 -131 15 -242 0 -403 -52 -355 -115 -616 -326 -763 -614 -109 -214 -140 -402 -105 -636 31 -206 69 -345 160 -584 53 -139 214 -569 470 -1260 265 -713 284 -756 412 -915 170 -211 369 -314 686 -356 172 -22 670 -33 1950 -40 l1188 -7 -4 -41 c-3 -22 -1 -51 4 -63 8 -22 12 -23 138 -23 145 0 141 -2 141 79 l0 48 838 8 c460 4 1861 6 3112 4 2153 -3 2279 -2 2355 15 194 43 298 138 350 321 22 76 23 192 1 274 -10 36 -42 128 -72 205 -31 78 -136 359 -235 626 -342 919 -307 833 -371 918 -51 68 -134 122 -243 157 -83 26 -171 80 -199 121 -29 43 -183 459 -297 804 -26 80 -68 206 -94 280 -61 178 -88 318 -130 668 -19 159 -68 548 -109 863 -116 882 -118 905 -119 1049 -1 221 30 309 274 770 69 132 90 203 96 335 7 131 -4 178 -71 311 -52 103 -135 211 -209 271 -158 130 -402 194 -612 159z",
    viewBox: "0 0 1600 1132",
    transform: "translate(0,1132) scale(0.1,-0.1)",
    start: { x: 7700, y: 1150, angle: 0 },
    startTickSize: 280,
    strokeWidth: 60,
    length: 3.531,
    turns: 14,
    direction: "CW",
  },

  // Cuiabá — circuito recente. Layout fluido, reta principal ao norte,
  // sequência de curvas médias e uma chicane perto do start.
  cuiaba: {
    id: "cuiaba",
    name: "Autódromo Internacional de Cuiabá",
    short: "Cuiabá",
    city: "Cuiabá",
    state: "MT",
    path: "M 16 42 L 14 28 Q 14 18 24 14 L 64 14 Q 78 14 84 22 Q 88 30 82 36 Q 74 40 70 36 Q 64 30 56 34 Q 50 38 52 44 Q 54 50 46 50 L 26 50 Q 16 50 16 42 Z",
    start: { x: 38, y: 14, angle: 0 },
    length: 2.95,
    turns: 13,
    direction: "CW",
  },
};

/**
 * Mapeia stage.id → circuito. Usado pelo popover pra puxar o desenho
 * da pista a partir do id da etapa (mesma cidade pode aparecer 2x).
 */
export const STAGE_TO_CIRCUIT: Record<string, keyof typeof CIRCUITS> = {
  "round-01": "interlagos",
  "round-02": "goiania",
  "round-03": "curvelo",
  "round-04": "cascavel",
  "round-05": "interlagos",
  "round-06": "santa_cruz",
  "round-07": "cuiaba",
  "round-08": "goiania",
};
