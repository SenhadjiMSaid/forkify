import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadDta = undefined) {
  try {
    const request = uploadDta
      ? await Promise.race([
          fetch(url, {
            method: 'POST',
            headers: {
              'content-Type': 'application/json',
            },
            body: JSON.stringify(uploadDta),
          }),
          timeout(TIMEOUT_SEC),
        ])
      : await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await request.json();
    if (!request.ok) throw new Error(`${data.message} (${request.status})`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
