import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import Loading from "./Loading"
import Bet from "./Bet";
import Wrapper from "../assets/wrappers/AllBetsContainer";
import PageButtonContainer from "./PageButtonContainer";

const AllBetsContainer = () => {
    const { searchDescription, searchSource, searchCategory, searchOddsMaker, searchPick, searchStatus, sort, getBets, bets, isLoading, page, numOfPages, totalBets } = useAppContext();

    useEffect(() => {
        console.log([page, searchDescription, searchSource, searchCategory, searchOddsMaker, searchPick, searchStatus, sort])
        getBets();
    }, [page, searchDescription, searchSource, searchCategory, searchOddsMaker, searchPick, searchStatus, sort]);

    if (isLoading) {
        return <Loading center />
    }

    if (bets.length === 0) {
        return (
            <Wrapper>
                <h2>No bets to display...</h2>
            </Wrapper>
        )
    }
    return (
        <Wrapper>
            <h5>
                {totalBets} bet{bets.length > 1 && 's'} found
            </h5>
            <div className="bets">
                {bets.map((bet) => {
                    return <Bet key={bet._id} {...bet} />
                })}
            </div>
            {/* pagination buttons */}
            {numOfPages > 1 && <PageButtonContainer />}
        </Wrapper>
    )
}

export default AllBetsContainer;;