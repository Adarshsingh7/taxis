

const storeLog = (level, message) => {
    const timestamp = new Date().toISOString();
    const logEntry = { level, message, timestamp };
    const logs = JSON.parse(localStorage.getItem('app_logs')) || [];
    logs.push(logEntry);

    localStorage.setItem('app_logs', JSON.stringify(logs));
  };
  
  export const log = (message) => {
    console.log(message);
    storeLog('LOG', message);
  };
  
  export const error = (message) => {
    console.error(message);
    storeLog('ERROR', message);
  };
  
  export const warn = (message) => {
    console.warn(message);
    storeLog('WARN', message);
  };
  
  export const info = (message) => {
    console.info(message);
    storeLog('INFO', message);
  };
  