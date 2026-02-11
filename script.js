(function () {
    var canvas = $('#canvas');

    if (!canvas[0].getContext) {
        $("#error").show();
        return false;
    }

    var width = canvas.width();
    var height = canvas.height();

    canvas.attr("width", width);
    canvas.attr("height", height);

    var opts = {
        seed: {
            x: width / 2 - 20,
            color: "rgb(190, 26, 37)",
            scale: 2
        },
        branch: [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]]
        ],
        bloom: {
            num: 700,
            width: 1080,
            height: 650,
        },
        footer: {
            width: 1200,
            height: 5,
            speed: 10,
        }
    }

    var tree = new Tree(canvas[0], width, height, opts);
    var seed = tree.seed;
    var foot = tree.footer;
    var hold = 1;

    canvas.click(function (e) {
        var offset = canvas.offset(), x, y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        if (seed.hover(x, y)) {
            hold = 0;
            canvas.unbind("click");
            canvas.unbind("mousemove");
            canvas.removeClass('hand');
        }
    }).mousemove(function (e) {
        var offset = canvas.offset(), x, y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        canvas.toggleClass('hand', seed.hover(x, y));
    });

    // En script.js, modifica la función seedAnimate:
var seedAnimate = eval(Jscex.compile("async", function () {
    seed.draw();
    while (hold) {
        $await(Jscex.Async.sleep(10));
    }
    
    // REPRODUCIR MÚSICA AL HACER CLIC EN EL CORAZÓN
    var music = document.getElementById('backgroundMusic');
    music.play().catch(function(error) {
        console.log("Error reproduciendo música:", error);
        // Si falla por políticas del navegador, intentamos reproducir con interacción del usuario
        document.body.addEventListener('click', function playMusicOnce() {
            music.play();
            document.body.removeEventListener('click', playMusicOnce);
        });
    });
    
    while (seed.canScale()) {
        seed.scale(0.95);
        $await(Jscex.Async.sleep(10));
    }
    while (seed.canMove()) {
        seed.move(0, 2);
        foot.draw();
        $await(Jscex.Async.sleep(10));
    }
}));

    var growAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.grow();
            $await(Jscex.Async.sleep(10));
        } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.flower(2);
            $await(Jscex.Async.sleep(10));
        } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile("async", function () {
        tree.snapshot("p1", 240, 0, 610, 680);
        while (tree.move("p1", 500, 0)) {
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
        foot.draw();
        tree.snapshot("p2", 500, 0, 610, 680);

        canvas.parent().css("background", "url(" + tree.toDataURL('image/png') + ")");
        canvas.css("background", "#F5E8DC");
        $await(Jscex.Async.sleep(300));
        canvas.css("background", "none");
    }));

    var jumpAnimate = eval(Jscex.compile("async", function () {
        var ctx = tree.ctx;
        while (true) {
            tree.ctx.clearRect(0, 0, width, height);
            tree.jump();
            foot.draw();
            $await(Jscex.Async.sleep(25));
        }
    }));

    // En script.js, modifica la parte del textAnimate:
var textAnimate = eval(Jscex.compile("async", function () {
    var together = new Date();
    together.setFullYear(2025, 5, 28); // 28 de junio de 2025
    together.setHours(0);
    together.setMinutes(0);
    together.setSeconds(0);
    together.setMilliseconds(0);

    $("#code").show().typewriter();
    $("#clock-box").fadeIn(500);
    while (true) {
        timeElapse(together);
        $await(Jscex.Async.sleep(1000));
    }
}));

    var runAsync = eval(Jscex.compile("async", function () {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());

        textAnimate().start();

        $await(jumpAnimate());
        
        // Mostrar el botón "¿Por qué ser mi San Valentín?" después de que termine la animación del árbol
        setTimeout(showContinueButton, 1000);
    }));

    runAsync().start();
    
    // Variables para controlar las páginas de la propuesta
    let currentPage = 1;
    const totalPages = 4;
    let selectedAnswer = null;
    
    // Función para mostrar corazones flotantes
    function createFloatingHearts() {
        const container = document.getElementById('floatingHearts');
        const heartColors = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '💗', '💓', '💞', '💕', '💘', '💝'];
        
        for (let i = 0; i < 25; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = heartColors[Math.floor(Math.random() * heartColors.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDelay = Math.random() * 15 + 's';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.opacity = Math.random() * 0.7 + 0.3;
            container.appendChild(heart);
        }
    }
    
    // Función para mostrar el botón de continuar
    function showContinueButton() {
        const btn = document.getElementById('continueBtn');
        btn.style.display = 'block';
        btn.style.animation = 'fadeInUp 0.5s ease forwards';
        
        // Agregar evento al botón
        btn.addEventListener('click', showValentineProposal);
    }
    
    // Función para mostrar la propuesta de San Valentín
    function showValentineProposal() {
        // Ocultar el árbol
        document.getElementById('main').style.display = 'none';
        
        // Mostrar la sección de propuesta
        const section = document.getElementById('continueSection');
        section.classList.add('active');
        
        // Crear corazones flotantes
        createFloatingHearts();
        
        // Actualizar navegación
        updateNavigation();
        
        // Configurar navegación con teclado
        document.addEventListener('keydown', handleKeyNavigation);
    }
    
    // Función para navegar a la página anterior
    function prevPage() {
        if (currentPage > 1) {
            document.getElementById(`page${currentPage}`).classList.remove('active');
            currentPage--;
            document.getElementById(`page${currentPage}`).classList.add('active');
            updateNavigation();
        }
    }
    
    // Función para navegar a la página siguiente
    function nextPage() {
        if (currentPage < totalPages) {
            document.getElementById(`page${currentPage}`).classList.remove('active');
            currentPage++;
            document.getElementById(`page${currentPage}`).classList.add('active');
            updateNavigation();
        }
    }
    
    // Función para actualizar la navegación
    function updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageIndicator = document.getElementById('pageIndicator');
        
        // Actualizar botones
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        
        // Actualizar texto del botón siguiente
        if (currentPage === totalPages) {
            nextBtn.innerHTML = 'Final <i class="fas fa-heart"></i>';
        } else {
            nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
        }
        
        // Actualizar indicador de página
        pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
    }
    
    // Función para manejar navegación con teclado
    function handleKeyNavigation(e) {
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight' || e.key === ' ') {
            nextPage();
        }
    }
    
    // Función para seleccionar respuesta
    window.selectAnswer = function(answer) {
        selectedAnswer = answer;
        
        // Efectos visuales para la respuesta seleccionada
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            if ((answer === 'obvious' && btn.classList.contains('obvious')) || 
                (answer === 'yes' && btn.classList.contains('yes'))) {
                // Animación de selección
                btn.style.transform = 'scale(1.1)';
                btn.style.boxShadow = '0 25px 50px rgba(211, 47, 117, 0.4)';
                
                // Crear efecto de confeti
                createConfetti();
                
                // Mostrar mensaje especial después de un breve delay
                setTimeout(() => {
                    if (answer === 'obvious') {
                        alert('¡Sabía que lo estabas esperando! ❤️\nPrepárate para la sorpresa más dulce...');
                    } else {
                        alert('¡Increíble! Me acabas de hacer la persona más feliz del mundo 🥰\nNuestro San Valentín será mágico...');
                    }
                    
                    // Ir a la página final automáticamente
                    nextPage();
                }, 800);
            } else {
                btn.style.opacity = '0.6';
                btn.style.transform = 'scale(0.95)';
            }
        });
    };
    
    // Función para crear efecto de confeti
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
        
        const heartColors = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = heartColors[Math.floor(Math.random() * heartColors.length)];
            confetti.style.position = 'absolute';
            confetti.style.fontSize = (Math.random() * 25 + 20) + 'px';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.opacity = '0';
            confetti.style.animation = `fall ${Math.random() * 2 + 1}s ease-in forwards`;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confettiContainer.appendChild(confetti);
        }
        
        // Remover el confeti después de la animación
        setTimeout(() => {
            confettiContainer.remove();
        }, 3000);
        
        // Agregar la animación de caída si no existe
        if (!document.querySelector('#confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes fall {
                    0% {
                        opacity: 0;
                        transform: translateY(-50px) rotate(0deg);
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(100vh) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Inicializar la navegación
    updateNavigation();
})();