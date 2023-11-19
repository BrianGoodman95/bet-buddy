import Leg from '../models/Leg.js'

export const convertAmericanToDecimal = (americanOdds) => {
  let decimalOdds;
  if (americanOdds >= 100) {
    decimalOdds = (americanOdds/100) + 1
  } else {
    decimalOdds = (100/Math.abs(americanOdds)) +1
  }
  console.log("dec odds: ", decimalOdds);
  return decimalOdds.toFixed(2)
}

export const convertDecimalToAmerican = (decimalOdds) => {
  let americanOdds;
  if (decimalOdds >= 2) {
    americanOdds = (decimalOdds - 1) * 100
  } else {
    americanOdds = -100 * (decimalOdds - 1)
  }
  return Math.floor(americanOdds)
}

export const calcTotalOdds = (totalOdds, legs) => {
  // Ensure that the input is an array and not empty
  if (!Array.isArray(legs) || legs.length === 0) {
    throw new Error('Invalid input. Expected a non-empty array of leg objects.');
  }
  let calcdTotalOdds = 1;
  let nonPushTotalOdds = 1;
  // Initialize the total odds to 1 (neutral value for multiplication)
  let legOdds = 1;
  // Loop through each leg and multiply the odds
  for (const leg of legs) {
    // Ensure that each leg object has an "odds" property
    if (typeof leg === 'object' && leg.hasOwnProperty('odds')) {
      // Safety check for if there's no decimal on the odds (need to conver to decimal from american then)
      legOdds = leg.odds;
      calcdTotalOdds *= legOdds;
      if (leg.status != 'Push') {
        nonPushTotalOdds *= legOdds
      }
      // console.log(legOdds, calcdTotalOdds);
    } else {
      throw new Error('Invalid leg object. Expected an object with an "odds" property.');
    }
  }
  return [calcdTotalOdds.toFixed(2), nonPushTotalOdds.toFixed(2)];
}

export const calcPotentialBetReturn = (totalOdds, totalStake, oddsBoost) => {
  const expectedBetReturn = ((1+oddsBoost) * totalStake * totalOdds); //Including the stake
  return expectedBetReturn.toFixed(2)
}

export const calcBetReturn = (expectedBetReturn, totalStake, status) => {
  let betReturn = 0;
  if (status === "Won") {
    betReturn = expectedBetReturn;
  } else if (status === "Push") {
    betReturn = totalStake;
  } else {
    betReturn = 0;
  }
  return betReturn
}

const getLegs = async (bet) => {
  const legs = [];
  if (bet.leg_ids) {
      for (const leg_id of bet.leg_ids) {
          const leg = await Leg.findOne({ _id: leg_id }).lean();
          if (!leg) {
              throw new NotFoundError(`No Event with id ${leg_id} Found`)
          }
          legs.push(leg);
      }
  }
  return legs
}

const calcBetStatus = (legs) => {
  const leg_statuses = legs.map(leg => leg.status);
  let betStatus = null;
  // ["Open", "Won", "Lost", "Push", "Live"]
  if (leg_statuses.includes("Lost")) {
    betStatus = "Lost";
  } else if (leg_statuses.includes("Live")) {
    betStatus = "Live";
  } else if (leg_statuses.includes("Open")) {
    betStatus = "Unsettled";
  } else if (leg_statuses.every(status => status === "Push")) {
    betStatus = "Push";
  } else if (leg_statuses.every(status => status === "Won" || status === "Push")) {
    betStatus = "Won";
  }
  return betStatus;
}

const updateBetData = (bet, decimalTotalOdds, expectedBetReturn, betReturn, betStatus) => {
  bet.totalOdds = decimalTotalOdds;
  bet.expectedBetReturn = expectedBetReturn;
  bet.betReturn = betReturn;
  bet.status = betStatus;
  return bet
}

const prepareBetData = async (bet) => {
  const { totalOdds, totalStake, oddsBoost } = bet;
  const legs = await getLegs(bet);

  // Check if we don't already have the total odds of the bet or can re-calculate them from the legs
  let decTotalOdds = totalOdds;
  let decMaxRemainingOdds = totalOdds;
  const allLegsHaveOdds = legs.every(leg => leg.odds !== null); // If every leg has a value for odds
  if (allLegsHaveOdds || totalOdds == 0) {
    const betOdds = calcTotalOdds(totalOdds, legs);
    decTotalOdds = betOdds[0]
    decMaxRemainingOdds = betOdds[1]
  }

  // Calculate the expectedBet return with function
  const expectedBetReturn = calcPotentialBetReturn(decTotalOdds, totalStake, oddsBoost); 
  
  // Calculate the expectedBet return with function
  const betStatus = calcBetStatus(legs);

  // Calculate betReturn with function
  const maxRemainingBetReturn = calcPotentialBetReturn(decMaxRemainingOdds, totalStake, oddsBoost); 
  const betReturn = calcBetReturn(maxRemainingBetReturn, totalStake, betStatus);

  // Update our bet with the new info
  const updatedBet = updateBetData(bet, decTotalOdds, expectedBetReturn, betReturn, betStatus);

  return updatedBet
}

export default prepareBetData