import {Request, Response, response} from 'express';
import Knex from '../database/connection';

class PointsController {
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await Knex('points').where('id', id).first();

    if (!point) {
      return res.status(400).json({ message: 'Point not found.' });
    }

    const items = await Knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return res.json({ point, items });
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body;
  
    const trx = await Knex.transaction();
  
    const point = {
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    };

    const insertedIds = await trx('points').insert({
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    });
  
    const point_id = insertedIds[0];
  
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    })
  
    await trx('point_items').insert(pointItems);
  
    return res.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;