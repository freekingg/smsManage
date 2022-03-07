import { Model, Sequelize } from 'sequelize';
import { InfoCrudMixin } from 'lin-mizar';
import sequelize from '../lib/db';
import { merge } from 'lodash';

class SmsDataModel extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      title: this.title,
      phone: this.phone,
      message: this.message,
      extra: this.extra,
      summary: this.summary,
      create_time: this.create_time
    };
    return origin;
  }
}

SmsDataModel.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    summary: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    message: {
      type: Sequelize.TEXT('long')
    },
    extra: {
      type: Sequelize.TEXT('long'),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'sms_data',
      modelName: 'sms_data'
    },
    InfoCrudMixin.options
  )
);
export { SmsDataModel };
