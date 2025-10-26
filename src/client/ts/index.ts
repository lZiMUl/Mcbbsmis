document.addEventListener('DOMContentLoaded', async function (): Promise<void> {
  try {
    const configResponse: Response = await fetch(
      new Request('/api/config', { method: 'GET' })
    );
    if (!configResponse.ok) throw new Error('Failed to fetch config');
    const config = await configResponse.json();

    setInterval(async (): Promise<void> => {
      try {
        await fetch(
          new Request('/api/status/web', {
            method: 'GET'
          })
        );
      } catch (e) {
        window.location.reload();
      }
    }, 5 * 1000);

    // Global
    (document.getElementById('host') as HTMLInputElement).value = config.host;
    (document.getElementById('port') as HTMLInputElement).value = config.port;
    (document.getElementById('language') as HTMLSelectElement).value =
      config.language;
    const identifierInput = document.getElementById(
      'identifier'
    ) as HTMLInputElement;
    identifierInput.value = config.identifier;
    identifierInput.addEventListener('input', (): void => {
      if (identifierInput.value.length > 1) {
        identifierInput.value = identifierInput.value.charAt(0);
      }
    });

    // Feature options
    const features = config.options || {};
    Object.keys(features).forEach((key: string): void => {
      const checkbox = document.querySelector(
        `input[type="checkbox"][name="${key}"]`
      ) as HTMLInputElement;
      if (checkbox) checkbox.checked = features[key];
    });

    // Bilibili
    if (config.bilibili) {
      (document.getElementById('roomid') as HTMLInputElement).value =
        config.bilibili.roomid;
      (document.getElementById('bili_userid') as HTMLInputElement).value =
        config.bilibili.userid;
      (document.getElementById('bili_username') as HTMLInputElement).value =
        config.bilibili.username;
    }

    // Xbox
    if (config.xbox) {
      (document.getElementById('xbox_username') as HTMLInputElement).value =
        config.xbox.username;
    }

    const startBtn = document.getElementById('start') as HTMLButtonElement;
    const statusResponse: Response = await fetch(
      new Request('/api/status', {
        method: 'GET'
      })
    );
    if (!statusResponse.ok) throw new Error('Failed to fetch status');
    const { status } = await statusResponse.json();

    if (status === 'running') {
      startBtn.style.display = 'none';
    } else if (status === 'stopping') {
      startBtn.style.display = 'block';
    } else {
      startBtn.style.display = 'none';
    }
    startBtn.addEventListener('click', async (): Promise<void> => {
      const startResponse: Response = await fetch(
        new Request('/api/start', {
          method: 'GET'
        })
      );
      if (startResponse.ok) startBtn.style.display = 'none';
    });
  } catch (err) {
    console.error('Error loading config:', err);
    const langError = document.getElementById('lang-error');
    if (langError) langError.style.display = 'block';
  }
});
