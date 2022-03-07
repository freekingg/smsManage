import { LinRouter, NotFound, disableLoading } from "lin-mizar";
import { groupRequired } from "../../middleware/jwt";
import { TaskSearchValidator } from "../../validator/task";
import { PositiveIdValidator } from "../../validator/common";

import { SmsDataDao } from "../../dao/sms-data"

const smsDataApi = new LinRouter({
  prefix: "/v1/sms/data",
  module: "信息列表",
});

const SmsDataDto = new SmsDataDao();

smsDataApi.get("/:id", async (ctx) => {
  const v = await new TaskSearchValidator().validate(ctx);
  const id = v.get("path.id");
  const item = await SmsDataDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022,
    });
  }
  ctx.json(item);
});

smsDataApi.get("/", async (ctx) => {
  const v = await new TaskSearchValidator().validate(ctx);
  const items = await SmsDataDto.getItems(v);
  ctx.json(items);
});

smsDataApi.post('/', async ctx => {
  const v = await new TaskSearchValidator().validate(ctx);
  await SmsDataDto.createItem(v);
  ctx.success({
    code: 12
  });
});

smsDataApi.linDelete(
  "deleteSmsData",
  "/:id",
  smsDataApi.permission("删除信息"),
  groupRequired,
  async (ctx) => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get("path.id");
    await SmsDataDto.deleteTask(id);
    ctx.success({
      code: 14,
    });
  }
);

module.exports = { smsDataApi, [disableLoading]: false };
