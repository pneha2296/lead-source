const BASE_URL = 'https://app1.com.bot';
// const BASE_URL = 'http://localhost:8000';
// const BASE_URL = "https://lexicostatistical-giggliest-sharika.ngrok-free.dev"
//------------------------------------------------------------------------------------
//Vendors API
export const IMAGE_EXP = BASE_URL + '/api/dig/v1/image';

//pdf
export const PDF_EXP = BASE_URL + '/api/dpg/v1/pdf'

export const PDF_CREDIT = BASE_URL + '/api/dpg/v1/credits'

export const API_KEY_GENERATE = BASE_URL + '/api/dpg/v1/auth/generate';

export const API_KEY_GET = BASE_URL + '/api/dpg/v1/auth/get';

export const API_STORAGE_GET = BASE_URL + "/api/dpg/v1/user/storage-config";

export const API_STORAGE_UPDATE = BASE_URL + "/api/dpg/v1/user/storage-config";

export const STORAGE_FILES = BASE_URL + '/api/dpg/v1/storage/files';
// export const STORAGE_FILES_BY_PATH = BASE_URL + '/api/dpg/v1/storage/files/by-path';
// export const STORAGE_STATS = BASE_URL + '/api/dpg/v1/storage/stats';
export const STORAGE_FILE_DELETE = BASE_URL + '/api/dpg/v1/storage/files';

export const STORAGE_BULK_DELETE = BASE_URL + '/api/dpg/v1/storage/files/bulk-delete';

export const CREDIT_HISTORY = BASE_URL + '/api/dpg/v1/credits/transaction-history';

export const DIG_WALLET_BALANCE = BASE_URL + '/api/dpg/v1/credits/wallet/balance';
export const DIG_WALLET_PURCHASE = BASE_URL + '/api/dpg/v1/credits/wallet/request-credits';

// export const TABLE = BASE_URL + '/api/dpg/v1/table'
// export const VOICE_CONFIG = BASE_URL + '/api/dpg/v1/voice-agent/config/env';
// export const VOICE_CONFIGS = BASE_URL + '/api/dpg/v1/voice-agent/configs/env'