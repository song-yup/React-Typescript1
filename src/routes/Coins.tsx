import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
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

const CoinsList = styled.ul``;

const Coin = styled.li`
    background-color: ${(props) => props.theme.cardBgColor};
    color: ${(props) => props.theme.textColor};
    border-radius: 15px;
    margin-bottom: 10px;
    border: 1px solid white;
    a {
        display: flex;
        align-items: center;
        padding: 20px;
        transition: color 0.2s ease-in;
    }
    &:hover {
        a {
            color: ${(props) => props.theme.accentColor}
        }
    }
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${(props)=>props.theme.accentColor};
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Img = styled.img`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

interface ICoinInterface {
    id: string,
    name: string,
    symbol: string,
    rank: number,
    is_new: boolean,
    is_active: boolean,
    type: string,
}

function Coins( ) {
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => {
        setDarkAtom((current) => !current);
        setIsDark((current) => !current);
    };
    const { isLoading, data } = useQuery<ICoinInterface[]>("allCoins", fetchCoins);
    const [isDark, setIsDark] = useState(false);

    // const [coins, setCoins] = useState<CoinInterface[]>([]);
    // const [loading, setLoading] = useState(true);
    
    // useEffect(() => {
    //     (async() => {
    //         const response = await fetch("https://api.coinpaprika.com/v1/coins");
    //         const json = await response.json();
    //         setCoins(json.slice(0,100));
    //         setLoading(false);
    //     })();
    // }, []);
    
    return (
        <Container>
            <Helmet>
                <title>코인</title>
            </Helmet>
            <Header>
                <Title>코인</Title>
                {isDark ? 
                <Img src="https://cdn-icons-png.flaticon.com/512/6360/6360844.png" onClick={toggleDarkAtom}></Img> : 
                <Img src="https://cdn-icons-png.flaticon.com/512/6714/6714978.png" onClick={toggleDarkAtom}></Img>
                }
            </Header>
            {isLoading ? (
                <Loader>"Loading..."</Loader>
            ) : (
                <CoinsList>
                    {data?.slice(0,100).map(coin =>(
                        <Coin key={coin.id}>
                            <Link 
                                to={{
                                    pathname: `/${coin.id}`,
                                    state: { name:coin.name },
                                }}
                            >
                            <Img src={`https://cryptoicon-api.pages.dev/api/icon/${coin.symbol.toLowerCase()}`} />
                            {coin.name} &rarr;</Link>
                        </Coin>
                    ))}
                </CoinsList>
            )}
        </Container>
    ); 
}

export default Coins;