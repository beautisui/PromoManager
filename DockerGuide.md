# How to Dockerize and Containerize Your Project

## Step 1. Build Docker Images

### ✅ Backend

```bash
docker build -t promotion-backend PromoManager
```

### ✅ Frontend

```bash
docker build -t promotion-frontend PromoFrontend
```

## Step 2. Create a Docker Network

 *To enable communication between frontend and backend containers:*

```bash
docker network create promotion-network
```

---

## Step 3. Run Containers

### ✅ Run Backend Container

```bash
docker run -d \
  --name promotion-backend \
  --network promotion-network \
  -v /PromoDb:/app/PromoDb \
  promotion-backend
```

### ✅ Run Frontend Container

```bash
docker run -d \
  --name promotion-frontend \
  --network promotion-network \
  -p 8000:80 \
  promotion-frontend
```

---

## Step 4. Access the Application

Open your browser and navigate to:

```
http://localhost:8000
```