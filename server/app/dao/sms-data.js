import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { set } from 'lodash';
import { SmsDataModel as Modals } from '../model/sms-data';

class SmsDataDao {
  async getItem(id) {
    const item = await Modals.findOne({
      where: {
        id
      }
    });
    return item;
  }

  async getItems(v) {
    const condition = {};
    const page = v.get('query.page');
    const limit = v.get('query.count');
    const phone = v.get('query.phone');
    const title = v.get('query.title');
    if (phone) {
      set(condition, 'phone', {
        [Sequelize.Op.like]: `%${phone}%`
      });
    }
    if (title) {
      set(condition, 'title', {
        [Sequelize.Op.like]: `%${title}%`
      });
    }

    const { rows, count } = await Modals.findAndCountAll({
      where: Object.assign({}, condition),
      order: [['create_time', 'DESC']],
      offset: page * limit,
      limit: limit
    });
    return {
      list: rows,
      total: count
    };
  }

  async createItem(v) {
    const bk = new Modals();
    bk.title = v.get('body.title');
    bk.phone = v.get('body.phone');
    bk.message = v.get('body.message');
    bk.extra = v.get('body.extra');
    bk.summary = v.get('body.summary');
    await bk.save();
  }

  async updateItem(v, id) {
    const book = await Modals.findByPk(id);
    if (!book) {
      throw new NotFound({
        code: 10022
      });
    }
    book.title = v.get('body.title');
    book.phone = v.get('body.phone');
    book.message = v.get('body.message');
    book.extra = v.get('body.extra');
    book.summary = v.get('body.summary');
    await book.save();
  }

  async deleteItem(id) {
    const book = await Modals.findOne({
      where: {
        id
      }
    });
    if (!book) {
      throw new NotFound({
        code: 10022
      });
    }
    book.destroy();
  }
}

export { SmsDataDao };
