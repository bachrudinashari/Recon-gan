
# Recon-gan

A sleek and minimalist platform for viewing reconftw scanning results.

## Features

- Clean and intuitive interface
- Simple authentication system
- Directory-based navigation
- Responsive design
- Optimized for reconftw results viewing

## Deployment Guide

### Prerequisites

1. Nginx installed on your VPS
2. Node.js and npm installed
3. Access to the VPS (SSH)

### Steps to Deploy

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Recon-gan.git
cd Recon-gan
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

4. **Configure Nginx**

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/recon-gan
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name 38.242.149.132;  # Replace with your domain if you have one

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Serve the React app
    location / {
        root /var/www/Recon-gan/dist;
        try_files $uri $uri/ /index.html;
        
        # Basic authentication
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    # Serve the Recon directory with JSON format listing
    location /Recon/ {
        alias /var/www/Recon-gan/Recon/;
        autoindex on;
        autoindex_format json;
        
        # Basic authentication
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }
}
```

5. **Set up Basic Authentication**

Create the password file:
```bash
sudo sh -c "echo -n 'admin:' >> /etc/nginx/.htpasswd"
sudo sh -c "openssl passwd -apr1 'bali123' >> /etc/nginx/.htpasswd"
```

6. **Enable the site and restart Nginx**

```bash
sudo ln -s /etc/nginx/sites-available/recon-gan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Deploy the built files**

```bash
sudo mkdir -p /var/www/Recon-gan
sudo cp -r dist/* /var/www/Recon-gan/
```

8. **Set proper permissions**

```bash
sudo chown -R www-data:www-data /var/www/Recon-gan
sudo chmod -R 755 /var/www/Recon-gan
```

## Accessing the Platform

After deployment, you can access the platform at `http://38.242.149.132`

Login credentials:
- Username: admin
- Password: bali123

## Security Considerations

1. It's recommended to set up SSL/TLS using Let's Encrypt
2. Regularly update the authentication credentials
3. Keep Nginx and the system updated
4. Consider implementing IP whitelisting if needed

## Contributing

Feel free to submit issues and enhancement requests!
