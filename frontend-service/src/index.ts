import {
    app
} from "./api";

// const gracefulShutdown = () => {
//   client.close()
//     .then(() => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     })
//     .catch(err => {
//       console.error('Error closing MongoDB connection', err);
//       process.exit(1);
//     });
// };

// process.on('SIGINT', gracefulShutdown);   // Catches Ctrl+C
// process.on('SIGTERM', gracefulShutdown);  // Catches kill command
// process.on('SIGQUIT', gracefulShutdown);  // Catches quit signal


app.listen(3001, () => {
    console.log('Frontend service running on port 3001');
});