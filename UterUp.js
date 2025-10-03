// ==UserScript==
// @name         UterUp Fly by Myszkin
// @namespace    http://tampermonkey.net/
// @version      6.0-PRO
// @description  Флай для UterUp.ru
// @author       Myszkin
// @match        *://uterup.ru/*
// @match        *://www.uterup.ru/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Конфигурация ---
    const FLY_KEY_TOGGLE = 'KeyT';     // Полёт (T)
    const FLY_KEY_UP = 'KeyW';         // Вверх (W)
    const FLY_KEY_DOWN = 'KeyS';       // Вниз (S)
    const FLY_KEY_LEFT = 'KeyA';       // Влево (A)
    const FLY_KEY_RIGHT = 'KeyD';      // Вправо (D)
    const FLY_SPEED_VERTICAL = 150;    // Вертикальная скорость
    const FLY_SPEED_HORIZONTAL = 120;  // Горизонтальная скорость

    let flyModeEnabled = false;
    let gameScene = null;
    let isHooked = false;

    // Моё лого
    const logoSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="1365.333" height="1365.333" viewBox="0 0 1024 1024"><path fill="white" d="M327.5 158.1c-34.6 5.3-66.1 22-91.6 48.6-19.4 20.2-31.9 43.7-38.1 71.3-2 9.2-2.3 13.1-2.3 32 0 16.6.5 23.5 1.8 30.5 6.8 33.5 23.3 63.4 48.8 88.1 7.1 6.9 20 17.1 26.5 21 1.6 1 1 2-6.4 10.4-24.4 27.6-39.7 54.8-51.6 91.5-9.1 28.5-11 40.5-11 70 0 20.2.4 26 2.2 36.9 7.7 44.7 24.5 82.7 50.7 115.1 8.8 10.8 26 27.8 37 36.5 32.8 26 74.4 44.1 119.2 52.1 14.8 2.6 59.6 3.9 66.7 1.9 8-2.2 14.6-9.6 14.6-16.3 0-1.3-1.7-6.2-3.9-10.8-8.9-19.3-12.6-37-11.8-55.4.7-13.4 2.3-20.6 7.2-31.1 11.5-25.1 38.4-48.4 66.6-57.8 13.6-4.6 22-5.5 68.9-7.7 49.8-2.3 82.1-9.2 113.5-24.3 23.1-11.1 38.7-22 57.4-40.1 13.3-12.9 26.6-28.3 29.2-34 2.4-5.2 2.5-14.2.2-17.5-1.6-2.4-14.6-16.3-69.8-75-28.9-30.7-64.3-68.5-70.9-75.7l-4.8-5.2 3.9-3.2c8.5-7.2 22.2-22 27.9-30.4 16.1-23.6 23.9-46.4 25.1-73.1 1.1-26-2.9-46.4-13.7-68.9-17.8-37.3-52.9-64.6-95.1-74-11.7-2.6-38.4-3.1-51.1-1-25.3 4.2-50.5 16.2-71 33.9-7.8 6.6-18.8 18.8-23.5 25.8l-2.5 3.8-5.1-7.3c-7.3-10.4-23.4-26.5-34-34.1-16-11.4-37-20.5-57.7-25.1-8.8-2-42.1-2.9-51.5-1.4m44.8 35c13.2 2.6 29.1 9.1 40.3 16.3 21.3 13.9 40.9 39.8 49.3 65.4 8.7 26.2 8.4 55.4-.9 78.8-4.3 10.7-3.8 15.5 2.3 21.2 3.6 3.4 8.1 3.7 20.8 1.1 15.1-3.1 42.8-3.4 55.9-.5 41.4 9 81.8 33.2 119.6 71.8 7.7 7.8 38.9 40.8 69.3 73.1l55.3 58.8-10.4 10.6c-23.1 23.5-44.4 37.3-73.1 47.2-22.9 7.9-46.6 11.6-83.2 13.1-56.5 2.4-69.4 4.8-97 18.5-28 13.9-51.3 37-64.5 63.9-9.3 18.9-12.8 37.5-11.6 61.6.5 11.4 3 28.3 5.1 35 .5 1.6-.1 1.7-6.2 1.3-40.7-2.7-76.1-13.9-110.7-35-39.5-24-70.1-63.1-85-108.5-6.6-19.9-8.7-32-9.3-53.8-1-32.5 3.5-57.3 15.8-88.3 10.9-27.4 23.9-47.1 44-66.8l11.8-11.6 7.8 1.3c4.3.6 12.8 1.5 18.9 1.9 9.1.6 11.7.4 14.9-1 13-5.4 15.5-19.2 5.2-28.2-4.1-3.6-9.1-5.3-15.7-5.3-7.7 0-22.5-2.9-31.2-6-16.2-5.9-35.9-19.4-46.9-32.2-30.6-35.5-40.5-80.2-27.4-123.5 11.9-39.2 47.9-71.2 90.5-80.3 12.3-2.7 33.1-2.6 46.3.1m238 3.4c46.9 7.1 81.1 41.7 87.6 88.9 3.5 24.9-2.5 51.2-16.3 71.9-5.2 7.9-20.2 23.5-29 30.2l-3.7 2.8-3.7-2.8c-42.4-31.3-93.8-50.4-135.5-50.5H502l.7-5.8c.5-3.1.8-12 .7-19.7-.1-14.9-1.6-25.4-6-41.2l-2.6-9.3 3.2-5.7c12.8-22.7 29.1-38.8 49.5-48.7 10.8-5.3 19.9-8.1 32-10 12-1.9 19-1.9 30.8-.1"/><path fill="white" d="M574.2 475.8q-10.05 3.6-15.6 12.6c-3.9 6.2-4.8 18.1-2.1 25.3 2.5 6.4 9.4 13.6 15.7 16.3 6.5 2.8 17.1 2.5 23.3-.8 13.5-7 19.7-24.1 13.6-37.7-6-13.5-21.4-20.5-34.9-15.7"/></svg>`;
    // Конвертируем SVG в Data URI
    const logoDataUri = 'data:image/svg+xml;base64,' + btoa(logoSvgString);


    // Менюшка
    const debugMenu = document.createElement('div');
    const headerDiv = document.createElement('div');
    const logoElement = document.createElement('img');
    const titleElement = document.createElement('b');
    const statusContentDiv = document.createElement('div');

    // Стили
    Object.assign(debugMenu.style, {
        position: 'fixed', top: '10px', left: '10px', padding: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', fontFamily: 'Arial, sans-serif',
        fontSize: '14px', borderRadius: '5px', zIndex: '99999', transition: 'all 0.3s'
    });

    // Лого + текст
    Object.assign(headerDiv.style, {
        display: 'flex', alignItems: 'center', paddingBottom: '5px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    });

    // Стили для лого
    logoElement.src = logoDataUri;
    Object.assign(logoElement.style, {
        width: '24px', height: '24px', marginRight: '8px', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))'
    });

    // Стили для статуса
    Object.assign(statusContentDiv.style, {
        paddingTop: '5px'
    });

    // Менюшка
    titleElement.textContent = 'Статус скрипта:';
    headerDiv.appendChild(logoElement);
    headerDiv.appendChild(titleElement);
    debugMenu.appendChild(headerDiv);
    debugMenu.appendChild(statusContentDiv);

    setTimeout(() => document.body.appendChild(debugMenu), 500);

    function updateDebugMenu(status, flyStatus = null) {
        let flyText = '';
        if (flyStatus !== null) {
            flyText = flyStatus ?
                '<br><span style="color: #66ff66;">Режим полета: ВКЛ</span>' :
                '<br><span style="color: #ff6666;">Режим полета: ВЫКЛ</span>';
            debugMenu.style.backgroundColor = flyStatus ? 'rgba(0, 50, 0, 0.8)' : 'rgba(50, 0, 0, 0.8)';
        } else {
             debugMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
        statusContentDiv.innerHTML = `${status}${flyText}`;
    }
    updateDebugMenu("Ожидание Phaser...");


    // --- 2. Логика перехвата (остается без изменений) ---
    Object.defineProperty(window, 'Phaser', {
        configurable: true,
        get() { return this._Phaser; },
        set(value) {
            if (isHooked || !value || !value.Game) {
                this._Phaser = value;
                return;
            }
            console.log('Myszkin: Объект Phaser обнаружен! Перехватываем конструктор игры');
            updateDebugMenu("Phaser обнаружен! Внедряемся...");
            const OriginalGame = value.Game;
            value.Game = function(...args) {
                console.log('Myszkin: Конструктор игры вызван! Захватываем экземпляр');
                updateDebugMenu("Экземпляр игры захвачен");
                const gameInstance = new OriginalGame(...args);
                const sceneFinder = setInterval(() => {
                    for (const scene of gameInstance.scene.scenes) {
                        if (scene && scene.sys.isActive() && scene.player && scene.player.body) {
                            clearInterval(sceneFinder);
                            gameScene = scene;
                            console.log('Myszkin: Сцена с утером найдена', gameScene);
                            activateFlyMode();
                            return;
                        }
                    }
                }, 500);
                return gameInstance;
            };
            this._Phaser = value;
            isHooked = true;
        }
    });

    // --- 3. Активация управления (остается без изменений) ---
    function activateFlyMode() {
        updateDebugMenu("Нажми 'T' для переключения.", false);

        document.addEventListener('keydown', (e) => {
            if (!gameScene) return;

            if (e.code === FLY_KEY_TOGGLE) {
                flyModeEnabled = !flyModeEnabled;
                gameScene.player.body.setAllowGravity(!flyModeEnabled);
                if (!flyModeEnabled) {
                    gameScene.player.body.setVelocity(0, 0);
                }
                updateDebugMenu("Нажми 'T' для переключения.", flyModeEnabled);
            }

            if (flyModeEnabled) {
                const playerBody = gameScene.player.body;
                switch (e.code) {
                    case FLY_KEY_UP:    playerBody.velocity.y = -FLY_SPEED_VERTICAL; break;
                    case FLY_KEY_DOWN:  playerBody.velocity.y = FLY_SPEED_VERTICAL; break;
                    case FLY_KEY_LEFT:  playerBody.velocity.x = -FLY_SPEED_HORIZONTAL; break;
                    case FLY_KEY_RIGHT: playerBody.velocity.x = FLY_SPEED_HORIZONTAL; break;
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (flyModeEnabled && gameScene) {
                const playerBody = gameScene.player.body;
                if (e.code === FLY_KEY_UP || e.code === FLY_KEY_DOWN) playerBody.velocity.y = 0;
                if (e.code === FLY_KEY_LEFT || e.code === FLY_KEY_RIGHT) playerBody.velocity.x = 0;
            }
        });
    }

})();
