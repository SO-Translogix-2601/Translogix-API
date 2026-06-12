docker compose up --build -d
docker exec -it translogix_db mongosh -u admin -p translogix2026 --authenticationDatabase admin


MONGOCOMPASS:
mongodb://admin:translogix2026@localhost:27017/?authSource=admin

WEBPAGE:
http://localhost:8081
username:admin
password:admin123
