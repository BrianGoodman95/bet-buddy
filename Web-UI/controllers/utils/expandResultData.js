import Bet from '../../models/Bet.js'
import Leg from '../../models/Leg.js'
import Event from '../../models/Event.js'
import Sport from '../../models/Sport.js'
import { BadRequestError, NotFoundError } from '../../errors/index.js'

const expandLegData = async (betData) => {
  for (const result of betData) {
      if (result.leg_ids) {
          const legs = [];
          for (const leg_id of result.leg_ids) {
              const leg = await Leg.findOne({ _id: leg_id }).lean();
              if (leg) {
                legs.push(leg);
              }
          }
          const updatedLegs = await expandEventData(legs);
          result.legs = updatedLegs
      }
      else {
          result.legs = null;
      }
  }
  const updatedBetData = betData.map(result => {
      // Create a copy of the object without the "sport_id" field
      const { leg_ids, ...updatedResult } = result;
      return updatedResult;
  });

  return updatedBetData;
};

const expandEventData = async (legData) => {
  for (const result of legData) {
      if (result.event_id) {
          const event = await Event.findOne({ _id: result.event_id }).lean();
          if (event) {
            const updatedEvent = await expandSportData([ event ])
            result.event = updatedEvent;
          }
      }
      else {
          result.event = null;
      }
  }
  const updatedLegData = legData.map((result) => {
      // Create a copy of the object without the "event_id" field
      const { event_id, ...updatedResult } = result;
      return updatedResult;
  });

  return updatedLegData;
};

const expandSportData = async (eventData) => {
  for (const result of eventData) {
      if (result.sport_id) {
          const sport = await Sport.findOne({ _id: result.sport_id }).lean();
          if (!sport) {
            throw new NotFoundError(`No Event with id ${sport_id} Found`)
          }
          result.sport = sport;
      }
      else {
          result.sport = null;
      }
  }
  const updatedEventData = eventData.map((result) => {
      // Create a copy of the object without the "sport_id" field
      const { sport_id, ...updatedResult } = result;
      return updatedResult;
  });

  return updatedEventData;
};

export { expandLegData, expandEventData, expandSportData }