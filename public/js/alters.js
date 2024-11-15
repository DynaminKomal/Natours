export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class='alert alert--${type}'>${msg}</div>`;
    const div = document.createElement('div');
    div.innerHTML = markup;
    document.querySelector('body').insertAdjacentElement('afterbegin', div.firstChild);

    window.setTimeout(() => {
        hideAlert();
    }, 2000);
};

export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }
};
