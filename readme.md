# Trackinv
Software as a service (saas) for management and tracking inventory.

## How to deploy / run
1. Clone this repo
1. Copy file `.env.example` to `.env` and set the environment / credentials
1. Install packages using `npm install`
1. Run using command `npm run dev` for development, or `npm run start` for production.

You can running using pm2 for load balancing 
> pm2 start app.js -i 2 --name container_name`

