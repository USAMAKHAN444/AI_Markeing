
import api from './config';
export { API_URL } from './config';
export { authAPI } from './auth';
export { campaignAPI, mockAPI } from './campaigns';
export { userAPI } from './user';
export { paymentAPI } from './payments';
export type { User, Campaign, CampaignRequest, ApiResponse, AuthResponse } from './types';

export default api;
