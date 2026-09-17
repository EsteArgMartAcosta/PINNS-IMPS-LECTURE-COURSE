window.SCIML_CONCEPTS = {
  nodes: [
    {
      id: 'pde', week: 1, x: 610, y: 330, size: 66, tone: 'core',
      label: { en: 'PDE', es: 'EDP' },
      eyebrow: { en: 'The object we want to understand', es: 'El objeto que queremos entender' },
      intuition: {
        en: 'A PDE is a rule coupling space, time, and derivatives. SciML does not remove this structure; it decides where to encode it: in the loss, the representation, the sampling, the boundary treatment, or the dynamics.',
        es: 'Una EDP es una regla que acopla espacio, tiempo y derivadas. SciML no elimina esa estructura; decide dónde codificarla: en la pérdida, la representación, el muestreo, las fronteras o la dinámica.'
      },
      math: '\\mathcal{F}[u](x,t)=0',
      why: {
        en: 'Everything else in the map is a design choice for approximating or learning objects constrained by this equation.',
        es: 'Todo lo demás en el mapa son decisiones de diseño para aproximar o aprender objetos restringidos por esta ecuación.'
      },
      limits: {
        en: 'A small residual alone does not identify the intended solution unless initial/boundary information and numerical resolution are adequate.',
        es: 'Un residuo pequeño por sí solo no identifica la solución deseada si la información inicial/de frontera o la resolución numérica son insuficientes.'
      },
      tags: ['week 1', 'numerical structure']
    },
    {
      id: 'nn', week: 1, x: 355, y: 165, size: 50, tone: 'w1',
      label: { en: 'Neural network', es: 'Red neuronal' },
      eyebrow: { en: 'A parametrized function', es: 'Una función parametrizada' },
      intuition: {
        en: 'The network is not “the physics”. It is a flexible parametrization whose inductive bias depends on architecture, activation, initialization, and representation.',
        es: 'La red no es “la física”. Es una parametrización flexible cuyo sesgo inductivo depende de la arquitectura, activación, inicialización y representación.'
      },
      math: 'u_{\\theta}(z)=\\mathcal{N}_{\\theta}(z)',
      why: { en: 'PINNs use the differentiability of uθ to build physics-based losses.', es: 'Las PINNs usan la diferenciabilidad de uθ para construir pérdidas basadas en física.' },
      limits: { en: 'Optimization quality and function-space bias can dominate the final error.', es: 'La calidad de la optimización y el sesgo del espacio funcional pueden dominar el error final.' },
      tags: ['week 1', 'representation']
    },
    {
      id: 'pinn', week: 1, x: 510, y: 180, size: 56, tone: 'w1',
      label: { en: 'PINN', es: 'PINN' },
      eyebrow: { en: 'Physics enters the objective', es: 'La física entra en el objetivo' },
      intuition: {
        en: 'A PINN approximates the field with a neural network and penalizes violations of the PDE plus initial and boundary conditions at sampled points.',
        es: 'Una PINN aproxima el campo con una red neuronal y penaliza violaciones de la EDP más condiciones iniciales y de frontera en puntos muestreados.'
      },
      math: '\\mathcal{L}(\\theta)=\\lambda_r\\mathcal{L}_{\\mathrm{PDE}}+\\lambda_{\\mathrm{IC}}\\mathcal{L}_{\\mathrm{IC}}+\\lambda_{\\mathrm{BC}}\\mathcal{L}_{\\mathrm{BC}}',
      why: { en: 'It converts a differential equation into an optimization problem.', es: 'Convierte una ecuación diferencial en un problema de optimización.' },
      limits: { en: 'Loss components can compete; sampling and representation determine what the optimizer actually sees.', es: 'Los términos de la pérdida pueden competir; el muestreo y la representación determinan qué ve realmente el optimizador.' },
      tags: ['week 1', 'Raissi 2019']
    },
    {
      id: 'residual', week: 1, x: 710, y: 160, size: 46, tone: 'w1',
      label: { en: 'PDE residual', es: 'Residuo EDP' },
      eyebrow: { en: 'Physics as a measurable violation', es: 'La física como violación medible' },
      intuition: { en: 'Automatic differentiation lets us evaluate derivatives of the network and form the PDE residual at collocation points.', es: 'La diferenciación automática permite evaluar derivadas de la red y formar el residuo de la EDP en puntos de colocación.' },
      math: '\\mathcal{R}_{\\theta}=\\mathcal{F}[u_{\\theta}]',
      why: { en: 'Residual minimization is the central training signal of a classical PINN.', es: 'Minimizar el residuo es la señal de entrenamiento central de una PINN clásica.' },
      limits: { en: 'Low residual at sampled points does not automatically imply low solution error everywhere.', es: 'Un residuo bajo en puntos muestreados no implica automáticamente bajo error de solución en todo el dominio.' },
      tags: ['week 1', 'autodiff']
    },
    {
      id: 'icbc', week: 1, x: 860, y: 230, size: 45, tone: 'w1',
      label: { en: 'IC / BC', es: 'CI / CF' },
      eyebrow: { en: 'Select the intended solution', es: 'Seleccionan la solución deseada' },
      intuition: { en: 'The PDE admits families of solutions. Initial and boundary information tells us which physical trajectory is intended.', es: 'La EDP admite familias de soluciones. La información inicial y de frontera indica cuál trayectoria física buscamos.' },
      math: 'u(0,x)=u_0(x),\\qquad \\mathcal{B}[u]=0\\ \\text{on }\\partial\\Omega',
      why: { en: 'They are not decorative regularizers; they are part of the mathematical problem.', es: 'No son regularizadores decorativos; hacen parte del problema matemático.' },
      limits: { en: 'Soft penalties can be poorly balanced; hard constraints change the admissible function class instead.', es: 'Las penalizaciones suaves pueden quedar mal balanceadas; las restricciones duras cambian directamente la clase de funciones admisible.' },
      tags: ['week 1', 'well-posedness']
    },
    {
      id: 'causality', week: 2, x: 350, y: 335, size: 50, tone: 'w2',
      label: { en: 'Causality', es: 'Causalidad' },
      eyebrow: { en: 'Do not learn the future before the past', es: 'No aprender el futuro antes del pasado' },
      intuition: { en: 'For time-dependent PDEs, errors at early times contaminate later states. Causal training changes the optimization schedule so later residuals are not treated as independent of earlier failure.', es: 'En EDP dependientes del tiempo, errores tempranos contaminan estados posteriores. El entrenamiento causal cambia la optimización para no tratar residuos tardíos como independientes de fallos previos.' },
      math: '\\mathcal{L}_{\\mathrm{causal}}(\\theta)=\\sum_i w_i(\\theta)\\,\\mathcal{L}_i(\\theta),\\qquad 0<w_i\\le 1',
      why: { en: 'It injects temporal ordering into training, not merely into the data.', es: 'Incorpora el orden temporal en el entrenamiento, no solo en los datos.' },
      limits: { en: 'Causal weighting is not the same as integrating a causal dynamical system, and it does not guarantee extrapolation accuracy.', es: 'La ponderación causal no es lo mismo que integrar un sistema dinámico causal, ni garantiza extrapolación precisa.' },
      tags: ['week 2', 'Wang 2024']
    },
    {
      id: 'spectralbias', week: 2, x: 315, y: 505, size: 50, tone: 'w2',
      label: { en: 'Spectral bias', es: 'Sesgo espectral' },
      eyebrow: { en: 'Low frequencies are often learned first', es: 'Frecuencias bajas suelen aprenderse primero' },
      intuition: { en: 'Standard neural networks can fit smooth, low-frequency components much more readily than oscillatory structure. For wave problems, this can be a dominant failure mode.', es: 'Las redes estándar suelen ajustar componentes suaves y de baja frecuencia más fácilmente que estructura oscilatoria. En ondas, esto puede dominar el fallo.' },
      math: 'u(x)=\\sum_k \\widehat{u}_k\\,\\phi_k(x)',
      why: { en: 'It motivates alternative representations such as Fourier features.', es: 'Motiva representaciones alternativas como Fourier features.' },
      limits: { en: 'A representation that exposes higher frequencies can improve expressivity while making derivatives and optimization harder.', es: 'Una representación que expone frecuencias altas puede mejorar expresividad y a la vez dificultar derivadas y optimización.' },
      tags: ['week 2', 'frequency']
    },
    {
      id: 'fourier', week: 3, x: 470, y: 540, size: 50, tone: 'w3',
      label: { en: 'Fourier features', es: 'Fourier features' },
      eyebrow: { en: 'Change the coordinate representation', es: 'Cambiar la representación de coordenadas' },
      intuition: { en: 'Instead of feeding only x and t, the network receives sinusoidal embeddings. This gives direct access to oscillatory basis functions before the MLP starts learning.', es: 'En lugar de alimentar solo x y t, la red recibe embeddings sinusoidales. Así tiene acceso directo a funciones oscilatorias antes de que el MLP empiece a aprender.' },
      math: '\\gamma(z)=\\big[\\sin(Bz),\\,\\cos(Bz)\\big]',
      why: { en: 'They are a representation-level response to spectral bias.', es: 'Son una respuesta a nivel de representación frente al sesgo espectral.' },
      limits: { en: 'Fourier features are not the same thing as evolving spectral coefficients in NeuSA.', es: 'Fourier features no son lo mismo que evolucionar coeficientes espectrales en NeuSA.' },
      tags: ['week 3', 'Ding 2025']
    },
    {
      id: 'sampling', week: 3, x: 680, y: 540, size: 50, tone: 'w3',
      label: { en: 'Adaptive sampling', es: 'Muestreo adaptativo' },
      eyebrow: { en: 'Choose where the model is interrogated', es: 'Elegir dónde interrogar al modelo' },
      intuition: { en: 'A PINN only receives physics information where residuals are evaluated. Adaptive sampling reallocates collocation effort toward regions judged difficult or informative.', es: 'Una PINN solo recibe información física donde se evalúa el residuo. El muestreo adaptativo redistribuye puntos hacia regiones difíciles o informativas.' },
      math: '\\mathcal{L}_r\\approx\\mathbb{E}_{z\\sim q_{\\theta}}\\!\\left[\\lvert\\mathcal{R}_{\\theta}(z)\\rvert^2\\right]',
      why: { en: 'Sampling is part of the effective objective, not just a plotting choice.', es: 'El muestreo forma parte del objetivo efectivo, no es solo una decisión visual.' },
      limits: { en: 'If q changes with the model, sampling and weighting effects can be confounded.', es: 'Si q cambia con el modelo, los efectos de muestreo y ponderación pueden confundirse.' },
      tags: ['week 3', 'Marques 2025']
    },
    {
      id: 'abc', week: 3, x: 890, y: 485, size: 50, tone: 'w3',
      label: { en: 'Absorbing BCs', es: 'Fronteras absorbentes' },
      eyebrow: { en: 'Let waves leave the computational domain', es: 'Permitir que las ondas salgan del dominio' },
      intuition: { en: 'A truncated computational domain can reflect waves artificially. Absorbing boundary conditions approximate an open domain by suppressing outgoing reflections.', es: 'Un dominio computacional truncado puede reflejar ondas artificialmente. Las fronteras absorbentes aproximan un dominio abierto suprimiendo reflexiones salientes.' },
      math: '\\mathcal{B}_{\\mathrm{ABC}}[u]\\approx0\\qquad\\text{on }\\partial\\Omega',
      why: { en: 'Boundary treatment can dominate wavefield quality even if interior residuals are small.', es: 'El tratamiento de frontera puede dominar la calidad del campo incluso con residuo interior pequeño.' },
      limits: { en: 'Different ABC orders and angles trade accuracy, stability, and implementation complexity.', es: 'Distintos órdenes y ángulos de ABC intercambian precisión, estabilidad y complejidad.' },
      tags: ['week 3', 'Higdon / Majda']
    },
    {
      id: 'neuralode', week: 4, x: 705, y: 330, size: 55, tone: 'w4',
      label: { en: 'Neural ODE', es: 'Neural ODE' },
      eyebrow: { en: 'Learn a vector field, then integrate it', es: 'Aprender un campo vectorial e integrarlo' },
      intuition: { en: 'The network does not output the full trajectory directly. It parametrizes the derivative of a hidden state, and a numerical integrator generates the trajectory.', es: 'La red no produce toda la trayectoria directamente. Parametriza la derivada de un estado oculto y un integrador numérico genera la trayectoria.' },
      math: '\\dot z(t)=f_{\\theta}(t,z(t)),\\qquad z(t_0)=z_0',
      why: { en: 'This makes numerical time integration part of the model.', es: 'Hace que la integración temporal numérica sea parte del modelo.' },
      limits: { en: 'Integrator error, stiffness, and learned-vector-field error are distinct sources of failure.', es: 'El error del integrador, la rigidez y el error del campo aprendido son fuentes distintas de fallo.' },
      tags: ['week 4', 'Chen 2018']
    },
    {
      id: 'integrator', week: 4, x: 790, y: 405, size: 44, tone: 'w4',
      label: { en: 'Integrator', es: 'Integrador' },
      eyebrow: { en: 'The learned dynamics are still numerical', es: 'La dinámica aprendida sigue siendo numérica' },
      intuition: { en: 'Once a vector field is learned, we still need a numerical method such as RK4 to move through time. Changing the step can change the prediction without changing the weights.', es: 'Aunque aprendamos un campo vectorial, necesitamos un método como RK4 para avanzar en el tiempo. Cambiar el paso puede cambiar la predicción sin cambiar los pesos.' },
      math: 'z_{n+1}=\\Psi_h(z_n;\\theta)',
      why: { en: 'It separates architecture quality from time-discretization quality.', es: 'Permite separar calidad de arquitectura de calidad de discretización temporal.' },
      limits: { en: 'A smaller step can help until model error dominates; it also increases cost.', es: 'Un paso menor puede ayudar hasta que domine el error del modelo; además aumenta el costo.' },
      tags: ['week 4', 'RK4']
    },
    {
      id: 'spectralbasis', week: 4, x: 945, y: 350, size: 48, tone: 'w4',
      label: { en: 'Spectral basis', es: 'Base espectral' },
      eyebrow: { en: 'Represent the field with known spatial modes', es: 'Representar el campo con modos espaciales conocidos' },
      intuition: { en: 'Differential operators can become simple algebraic operations in a suitable basis. NeuSA evolves the coefficients of that representation.', es: 'Operadores diferenciales pueden volverse operaciones algebraicas simples en una base adecuada. NeuSA evoluciona los coeficientes de esa representación.' },
      math: 'u_M(t,x)=\\sum_{k=1}^{M}a_k(t)\\,\\phi_k(x)',
      why: { en: 'It builds classical numerical structure directly into the architecture.', es: 'Integra estructura numérica clásica directamente en la arquitectura.' },
      limits: { en: 'Truncation error remains, and a better spatial basis does not guarantee the learned coefficient dynamics are accurate.', es: 'Sigue existiendo error de truncamiento y una mejor base espacial no garantiza una dinámica aprendida precisa.' },
      tags: ['week 4', 'spectral method']
    },
    {
      id: 'neusa', week: 4, x: 900, y: 190, size: 60, tone: 'w4',
      label: { en: 'NeuSA', es: 'NeuSA' },
      eyebrow: { en: 'Spectral state + learned dynamics', es: 'Estado espectral + dinámica aprendida' },
      intuition: { en: 'NeuSA combines a spectral representation with a learned ODE for its coefficients. The architecture can incorporate analytical dynamics and learn a correction.', es: 'NeuSA combina una representación espectral con una ODE aprendida para sus coeficientes. La arquitectura puede incorporar dinámica analítica y aprender una corrección.' },
      math: '\\dot a=b,\\qquad \\dot b=F_0(a)+\\varepsilon\\,\\mathcal{N}_{\\theta}(a)',
      why: { en: 'It changes where physics enters: not only in the loss, but also in the state representation and time evolution.', es: 'Cambia dónde entra la física: no solo en la pérdida, también en la representación del estado y su evolución temporal.' },
      limits: { en: 'Causal evolution does not imply accurate extrapolation. The learned vector field may fit one trajectory but transfer poorly.', es: 'Evolución causal no implica extrapolación precisa. El campo aprendido puede ajustar una trayectoria y transferir mal.' },
      tags: ['week 4', 'Bizzi 2025']
    },
    {
      id: 'transfer', week: 4, x: 1040, y: 455, size: 47, tone: 'cross',
      label: { en: 'Transfer', es: 'Transferencia' },
      eyebrow: { en: 'Does the learned dynamics work elsewhere?', es: '¿Funciona la dinámica aprendida en otros estados?' },
      intuition: { en: 'A tiny error on one training trajectory does not guarantee that the learned vector field is correct away from that trajectory.', es: 'Un error diminuto sobre una trayectoria de entrenamiento no garantiza que el campo vectorial aprendido sea correcto fuera de ella.' },
      math: '\\text{trajectory fit}\\;\\not\\equiv\\;\\text{vector-field identification}',
      why: { en: 'It is the key distinction exposed by our NeuSA experiments.', es: 'Es la distinción central expuesta por nuestros experimentos de NeuSA.' },
      limits: { en: 'Transfer claims are always protocol-specific: initial conditions, time horizon, seeds, and reference all matter.', es: 'Las afirmaciones de transferencia dependen del protocolo: condiciones iniciales, horizonte, semillas y referencia.' },
      tags: ['cross-cutting', 'our experiments']
    }
  ],
  edges: [
    ['pde','pinn','constrains'], ['nn','pinn','parametrizes'], ['pinn','residual','uses'], ['pinn','icbc','selects solution'],
    ['pinn','causality','training issue'], ['pinn','spectralbias','representation issue'], ['spectralbias','fourier','motivates'],
    ['pinn','sampling','where residual is seen'], ['pinn','abc','boundary physics'], ['pde','neuralode','dynamics'], ['neuralode','integrator','requires'],
    ['spectralbasis','neusa','representation'], ['neuralode','neusa','time evolution'], ['pde','spectralbasis','classical structure'],
    ['neusa','transfer','must test'], ['integrator','transfer','can affect'], ['spectralbasis','transfer','can affect'], ['pinn','transfer','not guaranteed']
  ]
};
