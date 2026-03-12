function getDateTimeString() {
  const dateNow = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  let timeNow = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).replace(/\s?[AP]M$/, '');

  return `${dateNow} ${timeNow}`;
}

module.exports = { getDateTimeString };