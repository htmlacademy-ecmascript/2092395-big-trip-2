const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function createElement(template) {
  // Создаем пустой div
  const newElement = document.createElement('div');
  // Берем HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
  newElement.innerHTML = template;
  // Возвращает этот DOM-элемент
  return newElement.firstElementChild;
}
// Берет компанент (view)
// вставляет в контейнер (DOM-элемент)
// Указывает куда вставить DOM-элемент (BEFOREEND)
// Вставляет DOM-элемент с помощью insertAdjacentElement
function render(component, container, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.getElement());
}

export {RenderPosition, createElement, render};
