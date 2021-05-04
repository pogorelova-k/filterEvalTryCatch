/* eslint-disable linebreak-style */
/*функция для фильтрации поля ввода по типу данных
    ипользуем rest оператор, чтобы получить каждое значение
    и проверяем значение, используя метод filter,
    если тип данных значения совпадает со значением typeInput, то вовзращаем его*/
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

    // функция, скрывающая блоки
    hideAllResponseBlocks = () => {
        // создаём массив из дивов с классом dialog__response-block
        // то есть все возможные блоки с результатами
        const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
        // перебираем массив и каждый блок скрываем
        responseBlocksArray.forEach(block => block.style.display = 'none');
    },

    /* функция, отображающая блок, получает:
        селектор(имя класса),
        строка=результат фильтрации, которая отобразится в поле результаты,
        span в блоке(id)*/
    showResponseBlock = (blockSelector, msgText, spanSelector) => {
        // вызываем функцию hideAllResponseBlocks
        // скрываем все элементы
        hideAllResponseBlocks();
        // получаем блок по по классу и добавляем его на страницу
        document.querySelector(blockSelector).style.display = 'block';
        // проверяем есть ли тег span в блоке
        if (spanSelector) {
            // в спан в виде текста записываем результат фильтрации
            document.querySelector(spanSelector).textContent = msgText;
        }
    },

    /* функции для отображения результата принимают строку,
        в callback функции мы вызывем  showResponseBlock для отображения блока и текста в нём
        а именно в теге span если он есть*/
    // функция отображения ошибки, если она появляется в конструкции try (tryFilterByType)
    showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

    // функция отображения резульата, если поле ввода не пустое
    showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

    // функция отображения результата, если поле-ввода было пустое
    showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

    /* функция фильтрации передаёт значения typeInput и dataInput*/
    tryFilterByType = (type, values) => {
        // выполняем/пытаемся выполнить конструкцию try
        try {
            /*  в valuesArray записываем отфильтрованную строку из поля ввода,
                    т е те значения которые соответсвуют по типу данных;
                eval - возвращает значение выполнения кода, переданного в функцию в виде строки;
                вызываем функцию filterByType и передаём туда значения инпутов;
                значение поля ввода, возвращаем строку, где элементы разделённы  так: ', ' */
            const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
            // проверяем не пустая ли отфильрованная строка
            const alertMsg = (valuesArray.length) ?
                // если не пустая, то alertMsg присваиваем строку для вывода в результаты в тег span
                `Данные с типом ${type}: ${valuesArray}` :
                // если поле пустое, то присваиваем соответствующую строку
                `Отсутствуют данные типа ${type}`;
            // вызываем функцию и передаём туда строка для сообщения в поле результаты
            showResults(alertMsg);
        // с случае возникновения ошибки в конструкции try? делаем конструкцию catch и дальше идём по коду
        } catch (e) {
            // в catch передали саму ошибку и вызваем функцию для отображения этой ошибки.
            // Передаём в функцию строку с ошибкой
            showError(`Ошибка: ${e}`);
        }
    };

// получаем кнопку по id
const filterButton = document.querySelector('#filter-btn');

// при клике на кнопку filterButton вызывается callback функция
filterButton.addEventListener('click', e => {
    // получаем наши инпуты
    const typeInput = document.querySelector('#type');
    const dataInput = document.querySelector('#data');

    // проверяем инпут для ввода строки
    if (dataInput.value === '') {
        // выводим сообщение под инпутом-ввода, если оно пустое
        dataInput.setCustomValidity('Поле не должно быть пустым!');
        // вызываем функцию showNoResults
        showNoResults();
    } else {
        // убираем сообщение под-инпутом ввода, если оно не пустое
        dataInput.setCustomValidity('');
        // отменяем явные действия при нажатии на кнопку
        e.preventDefault();
        // вызваем функцию tryFilterByType и передаём туда значения инпутов без пробелов в начале и конце строки
        tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
    }
});
