const sitesContainer = document.getElementById('sites');

fetch('sites.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('sites.json konnte nicht geladen werden');
    }

    return response.json();
  })
  .then(sites => {
    if (sites.length === 0) {
      sitesContainer.innerHTML = '<p>Noch keine Websites vorhanden.</p>';
      return;
    }

    sitesContainer.innerHTML = sites.map(site => `
      <a class="site-card" href="${site.slug}/">
        <h2>${site.titel}</h2>
        <p>${site.beschreibung}</p>
      </a>
    `).join('');
  })
  .catch(error => {
    console.error(error);
    sitesContainer.innerHTML = '<p>Die Websites konnten nicht geladen werden.</p>';
  });
