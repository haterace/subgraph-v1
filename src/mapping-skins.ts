import
{
    BigInt
} from "@graphprotocol/graph-ts"

import
{
    RatSkins,
    SkinCreated,
    Transfer
} from "../generated/RatSkins/RatSkins"

import
{
    Skin
} from "../generated/schema"


export function handleSkinCreated(event: SkinCreated): void
{
    let skin = Skin.load(event.params.skinId.toString());
    assert(skin, "Unknown skin");
    skin = skin as Skin;
    skin.rat = event.params.ratId.toString();
    skin.save();
}

export function handleTransfer(event: Transfer): void
{
    let skin = Skin.load(event.params.tokenId.toString());
    if (!skin)
    {
        skin = new Skin(event.params.tokenId.toString());
    }
    else
    {
        skin = skin as Skin;
    }
    skin.owner = event.params.to;
    skin.save();
}
