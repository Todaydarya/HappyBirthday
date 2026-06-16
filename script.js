document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cardsContainer');
    
    // 1. Логика группировки (как было раньше)
    const uniqueMessages = [...new Set(cardsData.map(card => card.message.trim()))];
    const groupColors = [
        'rgba(255, 107, 157, 0.8)', 'rgba(162, 155, 254, 0.8)', 'rgba(253, 203, 110, 0.8)', 
        'rgba(85, 239, 196, 0.8)', 'rgba(116, 185, 255, 0.8)', 'rgba(253, 121, 168, 0.8)'
    ];
    const messageGroupColor = {};
    uniqueMessages.forEach((message, index) => {
        messageGroupColor[message] = groupColors[index % groupColors.length];
    });
    
    // 2. Генерация карточек
    const cardsHTML = cardsData.map((card, index) => {
        const trimmedMessage = card.message.trim();
        const groupColor = messageGroupColor[trimmedMessage];
        const messageCount = cardsData.filter(c => c.message.trim() === trimmedMessage).length;
        const hasDuplicate = messageCount > 1;

        // --- НОВАЯ ЛОГИКА ДЛЯ ВЛАДИСЛАВА ---
        // Проверяем имя или наличие поля photo
        const isGoldenCard = card.name === "Владислав Завгородний" || card.photo; 
        
        let extraClasses = '';
        let inlineStyles = `animation-delay: ${0.1 * (index + 1)}s;`;

        if (isGoldenCard) {
            extraClasses += ' card--golden';
        } else if (hasDuplicate) {
            extraClasses += ' card--grouped';
            inlineStyles += ` --group-glow: ${groupColor};`;
        }

        return `
            <div class="card ${extraClasses}" style="${inlineStyles}" data-photo="${card.photo || ''}">
                <div class="card__header">
                    <div class="card__avatar" style="background: ${card.gradient};">
                        ${card.initial}
                    </div>
                    <div>
                        <div class="card__name">${card.name}</div>
                        <div class="card__relation">${card.relation}</div>
                    </div>
                </div>
                <div class="card__message">
                    ${card.message}
                    <span class="card__emoji">${card.emoji}</span>
                </div>
                ${hasDuplicate && !isGoldenCard ? `<div class="card__group-indicator">✨ Вместе с другими</div>` : ''}
                ${isGoldenCard ? `<div class="card__click-hint">Нажми, чтобы открыть фото 📸</div>` : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = cardsHTML;

    // 3. Обработка клика по карточке (Модальное окно)
    const cards = document.querySelectorAll('.card');
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.modal__close');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const photoSrc = card.getAttribute('data-photo');
            if (photoSrc && photoSrc !== "null" && photoSrc !== "") {
                modalImg.src = photoSrc;
                modal.classList.add('modal--active');
            }
        });
    });

    // Закрытие модального окна
    const closeFunc = () => modal.classList.remove('modal--active');
    closeModal.addEventListener('click', closeFunc);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeFunc(); // Закрыть при клике на фон
    });
});