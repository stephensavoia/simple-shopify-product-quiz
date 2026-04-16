// @ts-nocheck

class AVPCProductQuiz extends HTMLElement {
  constructor() {
    super();
    this.output = '';
    this.currentSlideIndex = 0;
    this.isTransitioning = false;
    this._heightRafId = null;
  }

  connectedCallback() {
    this.quizContainer = this.querySelector('.avpc-pq-quiz-container');
    this.slideElements = Array.from(this.querySelectorAll('.avpc-pq-quiz-slide'));
    this.questionSlideElements = Array.from(
      this.querySelectorAll('.avpc-pq-quiz-slide[data-slide="question"]')
    );
    this.answerInputElements = Array.from(
      this.querySelectorAll('.avpc-pq-answer-option input[type="radio"]')
    );
    this.resultSlideElements = Array.from(
      this.querySelectorAll('.avpc-pq-quiz-slide[data-slide="results"]')
    );
    this.placeholderSlideElement = this.querySelector(
      '.avpc-pq-quiz-slide[data-slide="results-placeholder"]'
    );
    this.currentRecommendation = null;
    this.mobileMediaQuery = window.matchMedia('(max-width: 800px)');

    this.updateProgressLabels();

    this._boundHandleInputChange = this.handleInputChange.bind(this);
    this._boundHandleViewportChange = this.handleViewportChange.bind(this);
    this._boundHandleAssetLoad = this.handleAssetLoad.bind(this);
    this.answerInputElements.forEach((inputElement) => {
      inputElement.addEventListener('change', this._boundHandleInputChange);
    });

    window.addEventListener('resize', this._boundHandleViewportChange);
    window.addEventListener('orientationchange', this._boundHandleViewportChange);
    if (this.mobileMediaQuery.addEventListener) {
      this.mobileMediaQuery.addEventListener('change', this._boundHandleViewportChange);
    } else if (this.mobileMediaQuery.addListener) {
      this.mobileMediaQuery.addListener(this._boundHandleViewportChange);
    }

    this.querySelectorAll('img').forEach((imageElement) => {
      imageElement.addEventListener('load', this._boundHandleAssetLoad);
    });

    if (window.ResizeObserver) {
      this.activeSlideResizeObserver = new ResizeObserver(() => {
        this.scheduleActiveSlideHeightSync();
      });
    }

    this.observeActiveSlide();
    this.scheduleActiveSlideHeightSync();

    this.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'next') this.goToSlide(this.currentSlideIndex + 1);
      if (action === 'back') {
        const currentSlide = this.slideElements[this.currentSlideIndex];
        const slideType = currentSlide?.dataset.slide;
        if (slideType === 'results' || slideType === 'results-placeholder') {
          const lastQuestion = this.questionSlideElements[this.questionSlideElements.length - 1];
          lastQuestion.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
          const lastQuestionIndex = this.slideElements.indexOf(lastQuestion);
          if (lastQuestionIndex >= 0) this.goToSlide(lastQuestionIndex);
        } else {
          const targetIndex = this.currentSlideIndex - 1;
          const targetSlide = this.slideElements[targetIndex];
          if (targetSlide) {
            targetSlide.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
          }
          this.goToSlide(targetIndex);
        }
      }
    });
  }

  disconnectedCallback() {
    if (this._heightRafId) {
      cancelAnimationFrame(this._heightRafId);
      this._heightRafId = null;
    }

    if (this._boundHandleInputChange && this.answerInputElements) {
      this.answerInputElements.forEach((inputElement) => {
        inputElement.removeEventListener('change', this._boundHandleInputChange);
      });
    }

    if (this._boundHandleAssetLoad) {
      this.querySelectorAll('img').forEach((imageElement) => {
        imageElement.removeEventListener('load', this._boundHandleAssetLoad);
      });
    }

    if (this.activeSlideResizeObserver) {
      this.activeSlideResizeObserver.disconnect();
    }

    if (this._boundHandleViewportChange) {
      window.removeEventListener('resize', this._boundHandleViewportChange);
      window.removeEventListener('orientationchange', this._boundHandleViewportChange);
      if (this.mobileMediaQuery?.removeEventListener) {
        this.mobileMediaQuery.removeEventListener('change', this._boundHandleViewportChange);
      } else if (this.mobileMediaQuery?.removeListener) {
        this.mobileMediaQuery.removeListener(this._boundHandleViewportChange);
      }
    }
  }

  isMobileViewport() {
    return this.mobileMediaQuery ? this.mobileMediaQuery.matches : window.innerWidth <= 800;
  }

  getActiveSlideElement() {
    if (!this.slideElements || !this.slideElements.length) return null;
    return this.slideElements[this.currentSlideIndex] || null;
  }

  observeActiveSlide() {
    if (!this.activeSlideResizeObserver) return;

    this.activeSlideResizeObserver.disconnect();
    const activeSlide = this.getActiveSlideElement();
    if (activeSlide) {
      this.activeSlideResizeObserver.observe(activeSlide);
    }
  }

  scheduleActiveSlideHeightSync() {
    if (this._heightRafId) {
      cancelAnimationFrame(this._heightRafId);
    }

    this._heightRafId = requestAnimationFrame(() => {
      this._heightRafId = null;
      this.syncActiveSlideHeight();
    });
  }

  syncActiveSlideHeight() {
    if (!this.quizContainer) return;

    if (!this.isMobileViewport()) {
      this.quizContainer.style.height = '';
      return;
    }

    const activeSlide = this.getActiveSlideElement();
    if (!activeSlide) return;

    const activeSlideHeight = Math.ceil(activeSlide.offsetHeight);
    if (activeSlideHeight > 0) {
      this.quizContainer.style.height = `${activeSlideHeight}px`;
    }
  }

  handleViewportChange() {
    this.scheduleActiveSlideHeightSync();
  }

  handleAssetLoad() {
    this.scheduleActiveSlideHeightSync();
  }

  updateProgressLabels() {
    const total = this.questionSlideElements.length;
    this.questionSlideElements.forEach((slide, index) => {
      const progressEl = slide.querySelector('[data-progress]');
      if (progressEl) {
        progressEl.textContent = `Step ${index + 1} of ${total}`;
      }
    });
  }

  goToSlide(targetIndex) {
    if (this.isTransitioning) return;
    if (targetIndex < 0 || targetIndex >= this.slideElements.length) return;
    if (targetIndex === this.currentSlideIndex) return;

    this.isTransitioning = true;
    const currentSlide = this.slideElements[this.currentSlideIndex];
    const nextSlide = this.slideElements[targetIndex];

    currentSlide.classList.remove('avpc-pq-active');

    setTimeout(() => {
      nextSlide.classList.add('avpc-pq-active');
      this.currentSlideIndex = targetIndex;
      this.observeActiveSlide();
      this.scheduleActiveSlideHeightSync();
      this.isTransitioning = false;
    }, 400);
  }

  handleInputChange() {
    this.updateResultsOutput();

    // Auto-advance after a short delay so the user sees their selection highlight
    setTimeout(() => {
      const lastQuestion = this.questionSlideElements[this.questionSlideElements.length - 1];
      const lastQuestionIndex = this.slideElements.indexOf(lastQuestion);

      if (this.currentSlideIndex === lastQuestionIndex) {
        this.goToResultSlide(this.currentRecommendation);
      } else {
        this.goToSlide(this.currentSlideIndex + 1);
      }
    }, 200);
  }

  goToResultSlide(recommendationNumber) {
    if (recommendationNumber !== null) {
      const matchingSlide = this.resultSlideElements.find(
        (el) => Number(el.dataset.productRecommendation) === recommendationNumber
      );
      if (matchingSlide) {
        this.goToSlide(this.slideElements.indexOf(matchingSlide));
        return;
      }
    }

    // Fall back to placeholder
    if (this.placeholderSlideElement) {
      this.goToSlide(this.slideElements.indexOf(this.placeholderSlideElement));
    }
  }

  getMostSelectedNumber(values) {
    const numberCounts = new Map();

    values
      .flatMap((value) => value.split(','))
      .map((value) => value.trim())
      .filter((value) => value !== '' && !Number.isNaN(Number(value)))
      .forEach((value) => {
        const numericValue = Number(value);
        const currentCount = numberCounts.get(numericValue) || 0;
        numberCounts.set(numericValue, currentCount + 1);
      });

    if (!numberCounts.size) return null;

    let winner = null;
    let winnerCount = -1;

    for (const [number, count] of numberCounts.entries()) {
      if (count > winnerCount || (count === winnerCount && number < winner)) {
        winner = number;
        winnerCount = count;
      }
    }

    return winner;
  }

  updateResultsOutput() {
    this.output = '';

    const selectedValues = Array.from(
      this.querySelectorAll('.avpc-pq-answer-option input[type="radio"]:checked')
    )
      .map((inputElement) => inputElement.value)
      .filter((value) => value !== '');

    this.currentRecommendation = this.getMostSelectedNumber(selectedValues);
  }
}

if (!customElements.get('avpc-product-quiz')) {
  customElements.define('avpc-product-quiz', AVPCProductQuiz);
}