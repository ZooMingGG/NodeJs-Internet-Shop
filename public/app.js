const toCurrency = price => {
  return new Intl.NumberFormat('ua-Ua', {
    currency: 'uah',
    style: 'currency'
  }).format(price);
};

const formatDate = date => {
  return new Intl.DateTimeFormat('ua-Ua', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
  node.textContent = formatDate(node.textContent);
});

const $card = document.querySelector('#card');

if ($card) {
  $card.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;
      
      fetch('/card/remove/' + id, {
        method: 'delete'
      }).then(res => res.json())
        .then(card => {
          if (card.courses.length) {
            const html = card.courses.map(course => {
              return `
                <tr>
                  <td>${course.title}</td>
                  <td>${course.count}</td>
                  <td>
                    <button class="btn btn-small js-remove" data-id="${course._id}">Delete</button>
                  </td>
                </tr>
              `;
            }).join('');
            $card.querySelector('tbody').innerHTML = html;
            $card.querySelector('.price').textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = 'Shopping Card is empty';
          }
        });
    }
  });
}

M.Tabs.init(document.querySelectorAll('.tabs'));
