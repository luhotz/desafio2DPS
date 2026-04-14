export const INITIAL_PLACES = [
  {
    id: '1',
    name: 'Edificio de Ingeniería',
    type: 'edificio',
    description: 'Edificio principal de la Facultad de Ingenieria donde puedes ir si tienes dudas sobre tu ingenieria',
    latitude: 13.715500,
    longitude: -89.152935,
    photos: [],
    reviews: [
      { id: 'r1', author: 'Carlos M.', text: 'Muy buenas instalaciones.', rating: 5, date: '2024-01-15' }
    ],
  },
  {
    id: '2',
    name: 'Biblioteca',
    type: 'edificio',
    description: 'Biblioteca principal de la UDB con amplio catálogo digital y físico. Ofrece salas de estudio individuales y grupales.',
    latitude: 13.716852737524684,
    longitude:  -89.15360676297666,
    photos: [],
    reviews: [
      { id: 'r2', author: 'María L.', text: 'Excelente lugar para estudiar, muy tranquilo.', rating: 5, date: '2024-02-10' }
    ],
  },
  {
    id: '3',
    name: 'Colecturia',
    type: 'Oficina',
    description: 'Colecturia donde los estudiantes realizan sus pagos tales como mensualidades',
    latitude: 13.716332444516762,
    longitude:  -89.15370149838405,
    photos: [],
    reviews: [],
  },
  {
    id: '4',
    name: 'Edificio CDIU',
    type: 'edificio',
    description: 'Aqui puedes encontrar asistencia academica y nuevo ingreso',
    latitude: 13.714987312152395,
    longitude: -89.15342896848435,
    photos: [],
    reviews: [
      { id: 'r3', author: 'Pedro R.', text: 'Atencion eficiente y respuestas concretas.', rating: 4, date: '2024-03-05' }
    ],
  },
  {
    id: '5',
    name: 'Aula Magna A',
    type: 'salon',
    description: 'Auditorio de la universidad para eventos, conferencias y graduaciones. Capacidad muy amplia de personas.',
    latitude: 13.715967666241076,
    longitude:  -89.15370538830912,
    photos: [],
    reviews: [],
  },
  {
    id: '6',
    name: 'Aula Magna B',
    type: 'Salon',
    description: 'Auditorio de la universidad para eventos, conferencias y graduaciones. Capacidad muy amplia de personas.',
    latitude: 13.715707745460872, 
    longitude: -89.15370874106951,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Ana G.', text: 'El personal es amable y atiende rápido.', rating: 4, date: '2024-01-20' }
    ],
  },
    {
    id: '7',
    name: 'Edificio A',
    type: 'edificio',
    description: 'Edificio A cuenta con 2 pisos, donde si tu numero de salon empieza con "1" es en la primera planta. y si empieza con "2" es es en la segunda planta.',
    latitude: 13.716028851778006,  
    longitude: -89.15341908885694,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Omari M.', text: 'Salones muy amplios', rating: 4, date: '2024-01-20' }
    ],
  },
      {
    id: '8',
    name: 'Edificio B',
    type: 'edificio',
    description: 'Edificio B cuenta con 2 pisos, donde si tu numero de salon empieza con "1" es en la primera planta. y si empieza con "2" es es en la segunda planta.',
    latitude: 13.715787157282824, 
    longitude: -89.1533380546811,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Omari M.', text: 'Salones muy amplios', rating: 4, date: '2024-01-20' }
    ],
  },
        {
    id: '9',
    name: 'Edificio C',
    type: 'edificio',
    description: 'Edificio C cuenta con 2 pisos, donde si tu numero de salon empieza con "1" es en la primera planta. y si empieza con "2" es es en la segunda planta.',
    latitude: 13.715259309165518, 
    longitude: -89.15325802212296,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Juan M.', text: 'la limpieza es constante en las aulas', rating: 5, date: '2024-01-20' }
    ],
  },

  {
    id: '10',
    name: 'Baños/Sanitarios',
    type: 'otros',
    description: 'Servicios sanitarios muy bien ubicados y con limpieza constante',
    latitude: 13.715485808712613, 
    longitude: -89.15342828338461,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Richard W.', text: 'muy buena higiene del lugar', rating: 5, date: '2024-01-20' }
    ],
  },

  {
    id: '11',
    name: 'Cajero BancoAgricola',
    type: 'otros',
    description: 'Cajero automatico para realizar retiros de efectivo',
    latitude: 13.7149545273517, 
    longitude: -89.15336503003142,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Andrea C.', text: 'Muy bien ubicado, me gusta que nunca se llena jajaja', rating: 5, date: '2024-01-20' }
    ],
  },

    {
    id: '12',
    name: 'Cancha de baloncesto',
    type: 'otros',
    description: '2 amplias canchas de baloncesto',
    latitude: 13.71562141144397, 
    longitude: -89.15239751446792,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Luis O.', text: 'bastante amplias, se arman buenos partidos siempre', rating: 5, date: '2024-01-20' }
    ],
  },

  {
    id: '13',
    name: 'Cancha de futbol',
    type: 'otros',
    description: 'cancha engramada para amantes del futbol',
    latitude: 13.715853040334155, 
    longitude: -89.1524346715429,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Mario M.', text: 'cesped de muy buena calidad', rating: 5, date: '2024-01-20' }
    ],
  },

  {
    id: '14',
    name: 'Pinacoteca y sala de estudio',
    type: 'edificio',
    description: 'muy amplia y equipada pinacoteca para pasar el rato o estudiar, en la parte de abajo se encuentra la sala de estudio equipada con cubiculos y aire acondicionado',
    latitude: 13.716777261821038,  
    longitude: -89.15320584078945,
    photos: [],
    reviews: [
      { id: 'r4', author: 'Jose A.', text: 'me gustaria que hubiera mas ventiladores en la pinacoteca', rating: 3, date: '2024-01-20' }
    ],
  },
];