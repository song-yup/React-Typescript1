import styled from "styled-components";

interface PriceProps {
  coinId: string;
  ath_price: number | undefined;
  ath_date: string | undefined;
  percent_change_30m: number | undefined;
  percent_change_1h: number | undefined;
  percent_change_24h: number | undefined;
  percent_change_7d: number | undefined;
  percent_change_30d: number | undefined;
  percent_change_1y: number | undefined;
  percent_from_price_ath: number | undefined;
}

const MaxContainer = styled.div`
  display: grid;
  justify-items: center;  
`;

const MaxBox = styled.div`
  background-color: ${(props) => props.theme.divColor};
  padding: 10px;
  border-radius: 15px;
  width: 100%;
  margin-bottom: 20px;
`;

const MaxStyle = styled.span`
  font-size: 14px;
  display: grid;
  justify-content: center;
  text-align: left;
  color: ${(props) => props.theme.grayText};
  font-weight: 600;
`;

const BoxContainter = styled.div`
  display: grid;
  justify-items: center;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);  
  margin-block-end: 10%;
`;


const Box = styled.div`
  background-color: ${(props) => props.theme.divColor};
  padding: 20px;
  border-radius: 15px;
  width: 100%;
`;

const PercentBox = styled.div<{ percent: number | undefined }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${(props) =>
    props.percent
      ? props.percent > 0
        ? "#4880EE"
        : props.percent < 0
        ? "#DA5157" 
        : "#000"
      : "none"};
`;

const Time = styled.span`
  font-size: 13px;
  display: block;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 10px;
  color: ${(props) => props.theme.grayText};
  font-weight: 600;
`;

const Percent = styled.span`
  font-size: 35px;
  font-weight: 600;
`;

function Price({ 
  coinId,
  ath_price,
  ath_date,
  percent_change_30m,
  percent_change_1h,
  percent_change_24h,
  percent_change_7d,
  percent_change_30d,
  percent_change_1y,
  percent_from_price_ath,}: PriceProps){

    const percentList = [
      {text: "30분", value: percent_change_30m},
      {text: "1시간", value: percent_change_1h},
      {text: "24시간", value: percent_change_24h},
      {text: "7일", value: percent_change_7d},
      {text: "30일", value: percent_change_30d},
      {text: "1년", value: percent_change_1y},
    ];
      
    return (
        <div>
              <MaxContainer>
                <MaxBox>
                  <MaxStyle>최고가: {ath_price?.toFixed(3)}  ({ath_date?.slice(0,10)})</MaxStyle>
                  <MaxStyle>최고가와 현재 시세의 차이</MaxStyle>
                  <PercentBox percent={percent_from_price_ath}>
                    <Percent>
                      {percent_from_price_ath && percent_from_price_ath > 0 
                      ? `To the moon!`
                      : `${percent_from_price_ath}%`}
                    </Percent>
                  </PercentBox>
                </MaxBox>
              </MaxContainer>
              <BoxContainter>{
              percentList.map( (item) => (
                <Box key ={item.text}>
                  <Time> {item.text}전과 현재 시세 차이</Time>
                  <PercentBox percent={item.value}>
                    <Percent>
                      {item.value && item.value > 0 
                      ? `+${item.value}%`
                      : `${item.value}%`}
                    </Percent>
                  </PercentBox> 
                </Box>
              ))}
              </BoxContainter>
        </div>
    );
}

export default Price;