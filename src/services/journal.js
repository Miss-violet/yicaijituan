import request from '../utils/request';
import { api } from '../utils/api';

const { journal } = api;

export async function log(params) {
  return request(journal.list, {
    method: 'POST',
    body: params,
  });
}
