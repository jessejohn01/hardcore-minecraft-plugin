import { HttpHeader, HttpRequest, HttpRequestMethod, http } from "@minecraft/server-net";

export function SendMessage(message: string) {
  const webhook = "INSERT WEBHOOK URL HERE";
  const request = new HttpRequest(webhook);
  request.method = HttpRequestMethod.Post;
  request.body = JSON.stringify({ content: `${message}` });
  request.headers = [new HttpHeader("Content-Type", "application/json")];

  http.request(request).then((response) => {});
}
