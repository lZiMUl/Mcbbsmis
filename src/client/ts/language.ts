import ILanguage from './interface/ILanguage';

document.addEventListener('DOMContentLoaded', async function () {
  const select: HTMLElement = document.getElementById(
    'language-select'
  ) as HTMLElement;
  const error: HTMLElement = document.getElementById(
    'lang-error'
  ) as HTMLElement;

  try {
    const res: Response = await fetch(
      new Request('/api/language', {
        method: 'GET'
      })
    );

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data: Array<ILanguage> = await res.json();
    select.innerHTML = '';
    data.forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = `${lang.name} (${lang.code})`;
      select.appendChild(opt);
    });
  } catch (err) {
    select.innerHTML = '<option value="">Select language</option>';
    error.style.display = 'block';
  }
});
