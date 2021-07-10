## ⬇ Установка и запуск

```shell
git clone https://github.com/SimidzuAy/vk-logger.git
cd vk-logger

# npm
npm install
npm run build
npm run start:prod

# yarn
yarn
yarn build
yarn start:prod
```

## ⚙ Конфиг
### [config/main.json](https://github.com/SimidzuAy/vk-logger/blob/master/config/main.json)
```json5
{
    "vk": {
        // Токен от VK с доступом к сообщениям
        "token": "",
        // URL для запросов к апи
        // Для случаев если требуется использовать прокси 
        // https://github.com/xtrafrancyz/vk-proxy
        "baseUrl": "https://api.vk.com/method/"
    },
    // Ключ для AES шифрования сообщений
    "encryption": ""
}
``` 

### [ormconfig.json](https://github.com/SimidzuAy/vk-logger/blob/master/ormconfig.json)
#### Конфиг [typeorm](https://typeorm.io/#/connection-options/) для работы с базой данных
❗ По умолчанию используется postgresql 



## 🚩 TODO
- [X] Пересланные сообщения 
- [X] Атачи `(фото/видео/стикеры/etc)`
- [X] Шифрование сообщений
- [X] История сообщений
- [ ] human-readable вывод сообщений
- [ ] Получение истории сообщений при первом запуске

