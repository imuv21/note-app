import DOMPurify from 'dompurify';

//format date and time
export const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return null;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

//format title
export const formatTitle = (title) => {
    if (!title) return '';
    const capitalized = title.charAt(0).toUpperCase() + title.slice(1);
    return capitalized.length > 20 ? `${capitalized.substring(0, 20)}...` : capitalized;
};

//format description
export const formatDescription = (htmlDescription, limit = 100) => {
    if (!htmlDescription) return '';

    let clean = DOMPurify.sanitize(htmlDescription, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br']
    });

    clean = clean.replace(/(^|>)([^<\s])/, (match, prefix, char) => prefix + char.toUpperCase());

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = clean;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    const truncated = textContent.length > limit ? textContent.substring(0, limit) + '...' : textContent;

    return truncated;
};
