# Things to Update
## Profile
Change the JobLocation to preferredOddsMakers. This will be helpful so that we only initially show bets for their preffered odds makers (instead of all of them). This means we'd need to get a list of all the oddsMakers first though. We'd have to store oddsMakers in a new table that we retrieve from looking at all the oddsMakers of events at a given time.

But if the oddsMakers change such that someones preferred one is no longer in the list, then we'd get a problem with the filter defaulting to show that one maybe. Probably would have to store the oddsMaker with an assigned "Id" such that we don't run into issues with change in spelling of an oddsMaker?

## Variables
### Job Location
Replacing it with preferredOddsMakers

### Bet Source
Get rid of it. We will store all bets the same way in the DB. This is more appropriate for a front end change that displays how to enter the bet differently. Like a toggle switch.

### Event Category and Description
Remove the word "event" from them, just Cateogry and Description

### Bet Status
Remove the word "bet" from it, just status
Remove the "Live" option until we find a way to track whether a game is in progress

## Add Bet
Make it recycle the All Bets functionality where it pulls up all the available bets from our "Events" db that we get from our 3P API. User can search for particular category, description, oddsMaker, etc to add the event to their betslip

If they want to add a custom bet, they can change the betSource to Custom and then the search results will disappear and the "Add Bet" button will come back

Need to add an "Add Bet" button to the component of the individually returned bets (instead of the edit and delete buttons)

