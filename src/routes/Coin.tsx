import { useEffect, useState } from "react";
import { Switch, Route, useLocation, useParams, Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${(props)=>props.theme.accentColor};
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #8b8989;
    padding: 10px 20px;
    border-radius: 10px;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span:first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;

const Description = styled.p`
    margin: 20px 0px;
`;

const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;

const Tab = styled.span<{ isActive:boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: #8b8989;
    padding: 7px 0px;
    border-radius: 10px;
    color: ${(props) => props.isActive ? props.theme.accentColor : props.theme.textColor};
    a {
        display: block;
    }
`;

const Img = styled.img`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

const Home = styled.div`
    align-items: center;
    margin-left: 200px;
`;

interface RouteParams {
    coinId: string;
}

interface RouteState {
    name: string;
}

interface IInfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    logo: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface IPriceData {
    id: string;
    name: string;
    symbol: string;
    rank: string;
    total_supply: string;
    max_supply: string;
    beta_value: string;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date:string;
            ath_price:number
            market_cap:number;
            market_cap_change_24h: number;
            percent_change_1h:number;
            percent_change_1y:number;
            percent_change_6h:number;
            percent_change_7d:number;
            percent_change_12h:number;
            percent_change_15m:number;
            percent_change_24h:number;
            percent_change_30d:number;
            percent_change_30m:number;
            percent_from_price_ath:number;
            price:number;
            volume_24h:number;
            volume_24h_change_24h:number;
        }
    };
}

function Coin() {
    // const [loading, setLoading] = useState(true);
    const { coinId } = useParams<RouteParams>();
    const { state } = useLocation<RouteState>();
    const [info, setInfo] = useState<IInfoData>();
    const [priceInfo, setPriceInfo] = useState<IPriceData>();
    const priceMatch = useRouteMatch("/:coinId/price");
    const chartMatch = useRouteMatch("/:coinId/chart");
    const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(["info", coinId], () =>  fetchCoinInfo(coinId));
    const { isLoading: tickersLoading, data: tickersData } = useQuery<IPriceData>(
        ["tickers", coinId], 
        () => fetchCoinTickers(coinId), 
        // {refetchInterval: 100000}
    );
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => {
        setDarkAtom((current) => !current);
        setIsDark((current) => !current);
    };
    const [isDark, setIsDark] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         const infoData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
    //         ).json();
    //         const priceData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
    //         ).json();
    //         setInfo(infoData);
    //         setPriceInfo(priceData);
    //         setLoading(false);
    //         console.log(infoData);
    //     })();
    // }, [coinId]);

    const loading = infoLoading || tickersLoading;

    return (
        <Container>
            <Helmet><title>{state?.name ? state.name : loading ? "Loading..." :  infoData?.name}</title></Helmet>
            <Home>
                <Link to={`/`}><Img src="https://cdn-icons-png.flaticon.com/512/7781/7781465.png" /></Link>                
            </Home>
            <Header>    
                <Title>{state?.name ? state.name : loading ? "Loading..." :  infoData?.name}</Title>
                {isDark ? 
                <Img src="https://cdn-icons-png.flaticon.com/512/6360/6360844.png" onClick={toggleDarkAtom}></Img> : 
                <Img src="https://cdn-icons-png.flaticon.com/512/6714/6714978.png" onClick={toggleDarkAtom}></Img>
                }
            </Header>
            {loading ? (
                <Loader>"Loading..."</Loader>
            ) : (
                <>
                    <Overview>
                        <OverviewItem>
                            <span>rank:</span> 
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>symbol:</span> 
                            <span>{infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>price:</span>
                            <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
                        </OverviewItem>
                    </Overview>
                    <Description>
                        {infoData?.description}
                    </Description>
                    <Overview>
                        <OverviewItem>
                            <span>total supply:</span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>max supply:</span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                    <Tabs>
                        <Tab isActive={chartMatch !== null}>
                            <Link to={`/${coinId}/chart`}>Chart</Link>
                        </Tab>
                        <Tab isActive={priceMatch !== null}>
                            <Link to={`/${coinId}/price`}>Price</Link>
                        </Tab>
                    </Tabs>
                    <Switch>
                        <Route path={`/${coinId}/price`}>
                        <Price 
                            coinId={coinId}
                            ath_price={tickersData?.quotes.USD.ath_price}
                            ath_date={tickersData?.quotes.USD.ath_date}
                            percent_change_30m={tickersData?.quotes.USD.percent_change_30m}
                            percent_change_1h={tickersData?.quotes.USD.percent_change_1h}
                            percent_change_24h={tickersData?.quotes.USD.percent_change_24h}
                            percent_change_7d={tickersData?.quotes.USD.percent_change_7d}
                            percent_change_30d={tickersData?.quotes.USD.percent_change_30d}
                            percent_change_1y={tickersData?.quotes.USD.percent_change_1y}
                            percent_from_price_ath={tickersData?.quotes.USD.percent_from_price_ath}               
                        />
                        </Route>
                        <Route path={`/${coinId}/chart`}>
                            <Chart coinId={coinId} />
                        </Route>
                    </Switch>
                </>
            )}
        </Container>
    ); 
}

export default Coin;