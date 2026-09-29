document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // MENU SUPERIOR — CLOCHE
  // =========================================================

  const clocheBtn = document.getElementById("cloche-btn");
  const navbar = document.getElementById("navbar");

  if (clocheBtn && navbar) {
    clocheBtn.addEventListener("click", () => {
      navbar.classList.toggle("menu-oculto");
    });
  }


  // =========================================================
  // SETA DA HOME → CARDÁPIO
  // =========================================================

  const scrollArrow = document.getElementById("scroll-arrow");
  const cardapioSection = document.getElementById("cardapio");

  if (scrollArrow && cardapioSection) {
    scrollArrow.addEventListener("click", () => {

      cardapioSection.classList.remove("cardapio-oculto");

      cardapioSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });
  }


  // =========================================================
  // CARDÁPIO — SELEÇÃO DOS DIAS
  // =========================================================

  const botoesDias = document.querySelectorAll(".dia-btn");
  const menusDias = document.querySelectorAll(".menu-dia");

  botoesDias.forEach((botao) => {

    botao.addEventListener("click", () => {

      const diaSelecionado = botao.dataset.dia;

      botoesDias.forEach((btn) => {
        btn.classList.remove("ativo");
      });

      botao.classList.add("ativo");

      menusDias.forEach((menu) => {
        menu.classList.remove("ativo");
      });

      const menuAtual = document.getElementById(diaSelecionado);

      if (menuAtual) {
        menuAtual.classList.add("ativo");
      }

    });

  });


  // =========================================================
  // CARROSSÉIS DO CARDÁPIO
  // =========================================================

  const carrosseisMenu = document.querySelectorAll(".menu-dia");

  carrosseisMenu.forEach((menu) => {

    const track = menu.querySelector(".menu-track");
    const btnPrev = menu.querySelector(".menu-arrow.prev");
    const btnNext = menu.querySelector(".menu-arrow.next");
    const indicadores = menu.querySelector(".menu-indicadores");
    const cards = menu.querySelectorAll(".menu-card");

    if (
      !track ||
      !btnPrev ||
      !btnNext ||
      !indicadores ||
      !cards.length
    ) {
      return;
    }


    // ---------------------------------------------------------
    // LARGURA DO CARD
    // ---------------------------------------------------------

    function larguraCard() {

      const card = cards[0];

      if (!card) {
        return 0;
      }

      const estilo = window.getComputedStyle(track);
      const gap = parseFloat(estilo.gap) || 0;

      return card.offsetWidth + gap;
    }


    // ---------------------------------------------------------
    // INDICADORES
    // ---------------------------------------------------------

    indicadores.innerHTML = "";

    cards.forEach((card, index) => {

      const indicador = document.createElement("button");

      indicador.type = "button";

      indicador.setAttribute(
        "aria-label",
        `Ver prato ${index + 1}`
      );

      if (index === 0) {
        indicador.classList.add("ativo");
      }

      indicador.addEventListener("click", () => {

        const distancia = larguraCard();

        track.scrollTo({
          left: distancia * index,
          behavior: "smooth"
        });

      });

      indicadores.appendChild(indicador);

    });


    // ---------------------------------------------------------
    // ATUALIZAR INDICADOR
    // ---------------------------------------------------------

    function atualizarIndicador() {

      const distancia = larguraCard();

      if (!distancia) {
        return;
      }

      let indice = Math.round(
        track.scrollLeft / distancia
      );

      indice = Math.max(
        0,
        Math.min(indice, cards.length - 1)
      );

      const indicadoresLista =
        indicadores.querySelectorAll("button");

      indicadoresLista.forEach((indicador, i) => {

        indicador.classList.toggle(
          "ativo",
          i === indice
        );

      });

    }


    // ---------------------------------------------------------
    // PRÓXIMO
    // ---------------------------------------------------------

    btnNext.addEventListener("click", () => {

      const distancia = larguraCard();

      track.scrollBy({
        left: distancia,
        behavior: "smooth"
      });

    });


    // ---------------------------------------------------------
    // ANTERIOR
    // ---------------------------------------------------------

    btnPrev.addEventListener("click", () => {

      const distancia = larguraCard();

      track.scrollBy({
        left: -distancia,
        behavior: "smooth"
      });

    });


    // ---------------------------------------------------------
    // SCROLL
    // ---------------------------------------------------------

    track.addEventListener(
      "scroll",
      atualizarIndicador,
      { passive: true }
    );

  });


  // =========================================================
  // CARROSSEL AUTOMÁTICO — AVALIAÇÕES
  // =========================================================

  const avaliacaoTrack =
    document.querySelector(".carrossel-track");

  if (avaliacaoTrack) {

    const cardsOriginais =
      Array.from(avaliacaoTrack.children);

    if (cardsOriginais.length) {

      // -------------------------------------------------------
      // CONFIGURAÇÃO
      // -------------------------------------------------------

      avaliacaoTrack.style.display = "flex";
      avaliacaoTrack.style.gap = "20px";
      avaliacaoTrack.style.overflowX = "auto";
      avaliacaoTrack.style.scrollbarWidth = "none";
      avaliacaoTrack.style.scrollBehavior = "auto";


      // -------------------------------------------------------
      // DUPLICA OS CARDS
      // -------------------------------------------------------

      cardsOriginais.forEach((card) => {

        const clone = card.cloneNode(true);

        clone.setAttribute(
          "aria-hidden",
          "true"
        );

        avaliacaoTrack.appendChild(clone);

      });


      // -------------------------------------------------------
      // VARIÁVEIS
      // -------------------------------------------------------

      let pausado = false;

      let ultimoTempo =
        performance.now();

      const velocidade = 35;


      // -------------------------------------------------------
      // SETAS DAS AVALIAÇÕES
      // -------------------------------------------------------

      const btnPrevAvaliacao =
        document.getElementById("btn-prev");

      const btnNextAvaliacao =
        document.getElementById("btn-next");


      // -------------------------------------------------------
      // LARGURA DO PRIMEIRO CONJUNTO
      // -------------------------------------------------------

      function larguraOriginal() {

        let largura = 0;

        cardsOriginais.forEach((card) => {

          largura += card.offsetWidth;

        });

        const estilo =
          window.getComputedStyle(
            avaliacaoTrack
          );

        const gap =
          parseFloat(estilo.gap) || 0;

        /*
         * Soma os espaços entre os cards originais
         */
        largura +=
          gap *
          (cardsOriginais.length - 1);

        /*
         * Espaço entre o último original
         * e o primeiro clone
         */
        largura += gap;

        return largura;
      }


      // -------------------------------------------------------
      // CORRIGIR POSIÇÃO DO CARROSSEL
      // -------------------------------------------------------

      function corrigirLoop() {

        const limite =
          larguraOriginal();

        if (!limite) {
          return;
        }

        /*
         * Se passou para a segunda cópia,
         * volta para a primeira.
         */
        if (
          avaliacaoTrack.scrollLeft >= limite
        ) {

          avaliacaoTrack.scrollLeft -= limite;

        }

        /*
         * Se passou para trás do começo,
         * vai para o final da primeira cópia.
         */
        else if (
          avaliacaoTrack.scrollLeft < 0
        ) {

          avaliacaoTrack.scrollLeft += limite;

        }

      }


      // -------------------------------------------------------
      // PRÓXIMA AVALIAÇÃO
      // -------------------------------------------------------

      function proximaAvaliacao() {

        const distancia =
          300;

        pausado = true;

        const limite =
          larguraOriginal();

        /*
         * Se já estamos perto do final,
         * reposiciona antes de avançar.
         */
        if (
          limite > 0 &&
          avaliacaoTrack.scrollLeft + distancia >= limite
        ) {

          avaliacaoTrack.scrollLeft -= limite;

        }

        avaliacaoTrack.scrollBy({
          left: distancia,
          behavior: "smooth"
        });

        setTimeout(() => {

          corrigirLoop();

          pausado = false;

          ultimoTempo =
            performance.now();

        }, 700);

      }


      // -------------------------------------------------------
      // AVALIAÇÃO ANTERIOR
      // -------------------------------------------------------

      function avaliacaoAnterior() {

        const distancia =
          300;

        pausado = true;

        const limite =
          larguraOriginal();

        /*
         * Se estamos no início,
         * pula para a segunda cópia.
         *
         * Isso permite continuar andando
         * infinitamente para a esquerda.
         */
        if (
          limite > 0 &&
          avaliacaoTrack.scrollLeft <= 5
        ) {

          avaliacaoTrack.scrollLeft =
            limite;

        }

        avaliacaoTrack.scrollBy({
          left: -distancia,
          behavior: "smooth"
        });

        setTimeout(() => {

          corrigirLoop();

          pausado = false;

          ultimoTempo =
            performance.now();

        }, 700);

      }


      // -------------------------------------------------------
      // BOTÃO ESQUERDA
      // -------------------------------------------------------

      if (btnPrevAvaliacao) {

        btnPrevAvaliacao.addEventListener(
          "click",
          avaliacaoAnterior
        );

      }


      // -------------------------------------------------------
      // BOTÃO DIREITA
      // -------------------------------------------------------

      if (btnNextAvaliacao) {

        btnNextAvaliacao.addEventListener(
          "click",
          proximaAvaliacao
        );

      }


      // -------------------------------------------------------
      // LOOP AUTOMÁTICO
      // -------------------------------------------------------

      function autoScroll(tempoAtual) {

        const delta =
          tempoAtual -
          ultimoTempo;

        ultimoTempo =
          tempoAtual;

        if (!pausado) {

          avaliacaoTrack.scrollLeft +=
            (velocidade * delta) / 1000;

          const limite =
            larguraOriginal();

          if (
            limite > 0 &&
            avaliacaoTrack.scrollLeft >= limite
          ) {

            avaliacaoTrack.scrollLeft -= limite;

          }

        }

        requestAnimationFrame(
          autoScroll
        );

      }


      // -------------------------------------------------------
      // MOUSE — PAUSA
      // -------------------------------------------------------

      avaliacaoTrack.addEventListener(
        "mouseenter",
        () => {

          pausado = true;

        }
      );


      avaliacaoTrack.addEventListener(
        "mouseleave",
        () => {

          pausado = false;

          ultimoTempo =
            performance.now();

        }
      );


      // -------------------------------------------------------
      // CELULAR — TOUCH
      // -------------------------------------------------------

      avaliacaoTrack.addEventListener(
        "touchstart",
        () => {

          pausado = true;

        },
        {
          passive: true
        }
      );


      avaliacaoTrack.addEventListener(
        "touchend",
        () => {

          pausado = false;

          ultimoTempo =
            performance.now();

        },
        {
          passive: true
        }
      );


      // -------------------------------------------------------
      // INICIA CARROSSEL
      // -------------------------------------------------------

      requestAnimationFrame(
        autoScroll
      );

    }

  }


  // =========================================================
  // RESERVA
  // =========================================================

  const formReserva =
    document.getElementById("form-reserva");

  const btnReserva =
    document.getElementById("btn-reserva");

  const mensagemSucesso =
    document.getElementById(
      "mensagem-sucesso"
    );

  const novaReserva =
    document.getElementById(
      "nova-reserva"
    );

  const nomeInput =
    document.getElementById("nome");

  const mensagemInput =
    document.getElementById(
      "mensagem"
    );

  const diaEscolhido =
    document.getElementById(
      "dia-escolhido"
    );

  const conviteDia =
    document.getElementById(
      "convite-dia"
    );

  const codigoSecreto =
    document.getElementById(
      "codigo-secreto"
    );

  const conviteNome =
    document.querySelector(
      ".convite-nome"
    );

  const feedbackDia =
    document.getElementById(
      "dia-selecionado-feedback"
    );

  const botoesReserva =
    document.querySelectorAll(
      ".dia-reserva-btn"
    );


  // =========================================================
  // SELEÇÃO DO DIA DA RESERVA
  // =========================================================

  botoesReserva.forEach((botao) => {

    botao.addEventListener(
      "click",
      () => {

        const dia =
          botao.dataset.dia;

        botoesReserva.forEach(
          (outroBotao) => {

            outroBotao.classList.remove(
              "ativo"
            );

          }
        );

        botao.classList.add(
          "ativo"
        );

        if (diaEscolhido) {

          diaEscolhido.value =
            dia;

        }

        if (feedbackDia) {

          feedbackDia.textContent =
            `✓ NOITE SELECIONADA: ${dia.toUpperCase()}`;

          feedbackDia.classList.add(
            "visivel"
          );

        }

      }
    );

  });


  // =========================================================
  // GERADOR DO CÓDIGO SECRETO
  // =========================================================

  function gerarCodigoSecreto() {

    const caracteres =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let codigo =
      "JS-";

    for (let i = 0; i < 5; i++) {

      const indice =
        Math.floor(
          Math.random() *
          caracteres.length
        );

      codigo +=
        caracteres[indice];

    }

    return codigo;

  }


  // =========================================================
  // ENVIO DA RESERVA
  // =========================================================

  if (
    btnReserva &&
    formReserva &&
    mensagemSucesso
  ) {

    btnReserva.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        const nome =
          nomeInput
            ? nomeInput.value.trim()
            : "";

        const dia =
          diaEscolhido
            ? diaEscolhido.value
            : "";

        const mensagem =
          mensagemInput
            ? mensagemInput.value.trim()
            : "";

        if (!nome) {

          alert(
            "Precisamos saber como devemos chamá-lo."
          );

          if (nomeInput) {
            nomeInput.focus();
          }

          return;

        }

        if (!dia) {

          alert(
            "Escolha a noite em que deseja jantar."
          );

          return;

        }

        const codigo =
          gerarCodigoSecreto();

        if (conviteDia) {

          conviteDia.textContent =
            `${dia.toUpperCase()} — 20:00`;

        }

        if (codigoSecreto) {

          codigoSecreto.textContent =
            codigo;

        }

        if (conviteNome) {

          conviteNome.textContent =
            `${nome}, sua presença foi registrada.`;

        }

        formReserva.style.display =
          "none";

        mensagemSucesso.style.display =
          "block";

        mensagemSucesso.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }
    );

  }


  // =========================================================
  // NOVA RESERVA
  // =========================================================

  if (
    novaReserva &&
    formReserva &&
    mensagemSucesso
  ) {

    novaReserva.addEventListener(
      "click",
      () => {

        formReserva.style.display =
          "grid";

        mensagemSucesso.style.display =
          "none";

        formReserva.reset();

        botoesReserva.forEach(
          (botao) => {

            botao.classList.remove(
              "ativo"
            );

          }
        );

        if (diaEscolhido) {

          diaEscolhido.value =
            "";

        }

        if (feedbackDia) {

          feedbackDia.textContent =
            "Selecione uma noite para continuar.";

          feedbackDia.classList.remove(
            "visivel"
          );

        }

        formReserva.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }
    );

  }


  // =========================================================
  // MODAL — CRÉDITOS DOS ÍCONES
  // =========================================================

  const btnCreditos =
    document.getElementById(
      "btn-creditos"
    );

  const modalCreditos =
    document.getElementById(
      "modal-creditos"
    );

  const fecharModal =
    document.getElementById(
      "fechar-modal"
    );

  if (
    btnCreditos &&
    modalCreditos &&
    fecharModal
  ) {

    btnCreditos.addEventListener(
      "click",
      () => {

        modalCreditos.classList.remove(
          "modal-oculto"
        );

      }
    );

    fecharModal.addEventListener(
      "click",
      () => {

        modalCreditos.classList.add(
          "modal-oculto"
        );

      }
    );

    modalCreditos.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          modalCreditos
        ) {

          modalCreditos.classList.add(
            "modal-oculto"
          );

        }

      }
    );

  }


  // =========================================================
  // MODAL — CRÉDITOS DAS CRIADORAS
  // =========================================================

  const btnCriadoras =
    document.getElementById(
      "btn-criadoras"
    );

  const modalCriadoras =
    document.getElementById(
      "modal-criadoras"
    );

  const fecharModalCriadoras =
    document.getElementById(
      "fechar-modal-criadoras"
    );

  if (
    btnCriadoras &&
    modalCriadoras &&
    fecharModalCriadoras
  ) {

    btnCriadoras.addEventListener(
      "click",
      () => {

        modalCriadoras.classList.remove(
          "modal-oculto"
        );

      }
    );

    fecharModalCriadoras.addEventListener(
      "click",
      () => {

        modalCriadoras.classList.add(
          "modal-oculto"
        );

      }
    );

    modalCriadoras.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          modalCriadoras
        ) {

          modalCriadoras.classList.add(
            "modal-oculto"
          );

        }

      }
    );

  }


  // =========================================================
  // FECHAR MODAIS COM ESC
  // =========================================================

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") {
        return;
      }

      if (modalCreditos) {

        modalCreditos.classList.add(
          "modal-oculto"
        );

      }

      if (modalCriadoras) {

        modalCriadoras.classList.add(
          "modal-oculto"
        );

      }

    }
  );

});
