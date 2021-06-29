function getValueFromURL(key) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const getValue = urlParams.get(key)
    return getValue
}