import
{
    BigInt
} from "@graphprotocol/graph-ts"

import
{
    RatFactory,
    BetMade,
    DepositAddressCreated,
    RaceFinished,
    RaceStarted,
    Transfer,
    Withdrawn
} from "../generated/RatFactory/RatFactory"

import
{
    Rat,
    DepositAddress,
    Hater,
    Bet,
    Race,
    Withdrawal
} from "../generated/schema"


export function handleBetMade(event: BetMade): void
{
    let bet = new Bet(event.transaction.hash.toHex());
    bet.race = event.params.raceId.toString();
    bet.rat = event.params.ratId.toString();
    bet.hater = event.params.user.toHex();
    bet.amount = event.params.amount;
    bet.save();

    let race = Race.load(bet.race);
    assert(race, "Bet on unknown race");
    race = race as Race;
    race.amount += bet.amount;
    race.save();
}

export function handleDepositAddressCreated(event: DepositAddressCreated): void
{
    let hater = Hater.load(event.transaction.from.toHex());
    if (!hater)
    {
        hater = new Hater(event.transaction.from.toHex());
    }
    hater.save();

    let depositKey = event.transaction.from.toHex() + "-" + event.params.ratId.toString();
    let depositAddress = DepositAddress.load(depositKey);
    if (!depositAddress)
    {
        depositAddress = new DepositAddress(depositKey);
        depositAddress.hater = hater.id;
        depositAddress.rat = event.params.ratId.toString();
    }
    else
    {
        depositAddress = depositAddress as DepositAddress;
    }
    depositAddress.address = event.params.deposit;
    depositAddress.save();
}

export function handleRaceFinished(event: RaceFinished): void
{
    let race = Race.load(event.params.raceId.toString());
    assert(race, "Unknown race has finished");
    race = race as Race;
    if (event.params.winnerRatId != BigInt.zero())
    {
        race.winner = event.params.winnerRatId.toString();
    }
    race.finished = true;
    race.save();
}

export function handleRaceStarted(event: RaceStarted): void
{
    let race = new Race(event.params.raceId.toString());
    race.launchTime = event.block.timestamp;
    race.finishTime = event.params.raceFinishTime;
    race.finished = false;
    race.save();
}

export function handleTransfer(event: Transfer): void
{
    let rat = Rat.load(event.params.tokenId.toString());
    if (!rat)
    {
        rat = new Rat(event.params.tokenId.toString());
    }
    else
    {
        rat = rat as Rat;
    }
    rat.owner = event.params.to;
    rat.save();
}

export function handleWithdrawn(event: Withdrawn): void
{
    let withdrawal = new Withdrawal(event.transaction.hash.toHex());
    withdrawal.hater = event.transaction.from.toHex();
    withdrawal.race = event.params.raceId.toString();
    withdrawal.withdrawalTime = event.block.timestamp;
    withdrawal.amount = event.params.amount;
    withdrawal.save();
}
