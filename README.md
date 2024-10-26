# Terra One Coding Challenge for System Engineers

## Goal

This challenge is designed to test your ability to handle real-time data processing, implement scalable architectures, and effectively manage distributed microservices.

## Challenge

You can find the challenge [here](https://docs.google.com/document/d/1fhYF3M1IKbiDjCEj_C0Lnv_SIkPPphhG9sWserl_DtI/)

## Setup

1. Fork this repository
2. Clone the forked repository
3. Run `npm start` to start all necessary services
4. Run `npm kafka:setup` to create the necessary Kafka topics
5. Implement the challenge. We marked all relevant places with `// YOUR CODE HERE` comments
   - The frontend service is reachable via `http://localhost:3000`. You can use the provided frontend to test your implementation
6. Push your code to your forked repository
7. Submit the link to your forked repository

Happy Coding 🚀


## Changes

Here's a README section that outlines the changes in a clear and organized manner:

---

## Changelog

### Modified Files
- **Calculation Service**
  - `package.json`: Updated dependencies and scripts.
  - `src/db.ts`: database connection logic.
  - `src/index.ts`: PNL calculation service.
  - `src/db_service.ts`: Database service interaction.
  - `src/transformation.ts`: Copied transformation logic.
  - `src/types.ts`: Changed type added startTime, endTime.

- **Docker Configuration**
  - `docker-compose.yml`: Updated service configurations for multiple instances.

- **Frontend Service**
  - `package-lock.json`: Added mongodb.
  - `package.json`: Added mongodb.
  - `src/api.ts`: API services changes
  - `src/db.ts`: Database connection logic.
  - `src/open-position.ts`: Read open position from DB.
  - `src/pnl.ts`: Read PNL from DB.
  - `src/transformation.ts`: Migrated to calculation service.
  - `src/types.ts`:  Migrated to calculation service.

- **Kafka Producer**
  - `src/index.ts`: Updated Kafka message production logic to have partition keys based on timeframe.
                   Resetting keys on every market message so that all trades and market price message goes to same instance and not different to avoid saving changes to db on every trade.
  - `src/types.ts`: Modified types for Kafka messages.
