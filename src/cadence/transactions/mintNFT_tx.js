export const mintNFT = 
// REPLACE THIS WITH YOUR CONTRACT NAME + ADDRESS
`import ExperienceV1 from 0xf4958a0f78c46964 
// This remains the same 
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

transaction(
  recipient: Address,
  name: String,
  description: String,
  thumbnail: String,
) {
  prepare(signer: AuthAccount) {
    if signer.borrow<&ExperienceV1.Collection>(from: ExperienceV1.CollectionStoragePath) != nil {
      return
    }

    // Create a new empty collection
    let collection <- ExperienceV1.createEmptyCollection()

    // save it to the account
    signer.save(<-collection, to: ExperienceV1.CollectionStoragePath)

    // create a public capability for the collection
    signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
      ExperienceV1.CollectionPublicPath,
      target: ExperienceV1.CollectionStoragePath
    )
  }


  execute {
    // Borrow the recipient's public NFT collection reference
    let receiver = getAccount(recipient)
      .getCapability(ExperienceV1.CollectionPublicPath)
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not get receiver reference to the NFT Collection")

    // Mint the NFT and deposit it to the recipient's collection
    ExperienceV1.mintNFT(
      recipient: receiver,
      name: name,
      description: description,
      thumbnail: thumbnail,
    )
    
    log("Minted an NFT and stored it into the collection")
  } 
}`