export async function enterFullscreen(el: HTMLElement) {
  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen(); // 支持的浏览器会隐藏导航栏
      // @ts-ignore backward compatibility
    } else if (el.webkitRequestFullscreen) {
      // @ts-ignore backward compatibility
      await el.webkitRequestFullscreen(); // Safari
      // @ts-ignore backward compatibility
    } else if (el.msRequestFullscreen) {
      // @ts-ignore backward compatibility
      el.msRequestFullscreen(); // 旧版 IE/Edge
    }
  } catch (err) {
    console.error("Can not enter fullscreen:", err);
  }
}

export async function exitFullscreen() {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
      // @ts-ignore backward compatibility
    } else if (document.webkitExitFullscreen) {
      // @ts-ignore backward compatibility
      await document.webkitExitFullscreen();
      // @ts-ignore backward compatibility
    } else if (document.msExitFullscreen) {
      // @ts-ignore backward compatibility
      document.msExitFullscreen();
    }
  } catch (err) {
    console.error("Can not exit fullscreen:", err);
  }
}
