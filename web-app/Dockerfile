FROM denoland/deno:latest

WORKDIR /app

COPY . .

EXPOSE 8000

ENV BASE_URL="https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws"

CMD ["deno", "run", "-A", "--watch=static/,routes/", "dev.ts"]
