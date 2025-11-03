document.addEventListener('DOMContentLoaded', async function (): Promise<void> {
  try {
    const localeResponse: Response = await fetch(
      new Request('/api/locale', {
        method: 'GET'
      })
    );
    if (!localeResponse.ok) throw new Error('HTTP ' + localeResponse.status);
    const data = await localeResponse.json();

    const configResponse: Response = await fetch(
      new Request('/api/config', { method: 'GET' })
    );
    if (!configResponse.ok) throw new Error('Failed to fetch config');
    const config = await configResponse.json();

    const features = config.options || {};

    [
      'title',
      'globalSettings',
      'host',
      'port',
      'language',
      'identifier',
      'listenToEvents',
      'join',
      'follow',
      'share',
      'view',
      'online',
      'like',
      'danmaku',
      'gift',
      'bilibiliProfile',
      'bili-roomid',
      'bili-userid',
      'bili-username',
      'xbox-username',
      'save-configuration'
    ]
      .map(id => document.getElementById(id))
      .forEach(item => {
        console.info(item);
        if (item)
          switch (item.id) {
            case 'title':
              item.innerText = `Mcbbsmis ${data[item.id]}`;
              break;
            case 'globalSettings':
              item.innerText = `🌍 ${data[item.id]}`;
              break;
            case 'event':
              item.innerText = `⚙️ ${data[item.id]}`;
              break;
            case 'join':
            case 'follow':
            case 'share':
            case 'view':
            case 'online':
            case 'like':
            case 'danmaku':
            case 'gift':
              // Feature options
              const checkbox = document.createElement('input');
              checkbox.setAttribute('type', 'checkbox');
              checkbox.setAttribute('name', item.id);
              if (features[item.id]) checkbox.setAttribute('checked', '');
              item.appendChild(checkbox);
              item.append(data[item.id]);
              break;
            case 'bilibiliProfile':
              item.innerText = `🎬 Bilibili ${data[item.id]}`;
              break;
            case 'save-configuration':
              item.innerText = `💾 ${data[item.id]}`;
              break;
            default:
              item.innerText = data[item.id];
          }
      });

    // Global
    (document.getElementById('host-input') as HTMLInputElement).value =
      config.host;
    (document.getElementById('port-input') as HTMLInputElement).value =
      config.port;
    (document.getElementById('language-select') as HTMLSelectElement).value =
      config.language;
    const identifierInput = document.getElementById(
      'identifier-input'
    ) as HTMLInputElement;
    identifierInput.value = config.identifier;
    identifierInput.addEventListener('input', (): void => {
      if (identifierInput.value.length > 1) {
        identifierInput.value = identifierInput.value.charAt(0);
      }
    });

    // Bilibili
    if (config.bilibili) {
      (document.getElementById('roomid-input') as HTMLInputElement).value =
        config.bilibili.roomid;
      (document.getElementById('bili_userid-input') as HTMLInputElement).value =
        config.bilibili.userid;
      (
        document.getElementById('bili_username-input') as HTMLInputElement
      ).value = config.bilibili.username;
    }

    // Xbox
    if (config.xbox) {
      (
        document.getElementById('xbox_username-input') as HTMLInputElement
      ).value = config.xbox.username;
    }
  } catch (err) {
    console.error('Error loading config:', err);
  }
});
