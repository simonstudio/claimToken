import { Component, ReactNode } from 'react';
import Text from '../../../../../components/atom/Text';
import BoxOutline from '../../../../../components/atom/Box/BoxOutline';
import { Grid, List, ListItem, styled } from '@mui/material';
import { Theme } from '@emotion/react';
import { theme } from '../../../../../HOCs/useDetachScreen';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../../i18';

class RoadMapPhase extends Component<I18n> {



  render(): ReactNode {

    const { t } = this.props;

    const data = [
      {
        index: 1,
        title: t?.('roadmap.foundation'),
        content: [
          {
            title: t?.('roadmap.smart_contract_1.0.label'),
            description: t?.('roadmap.smart_contract_1.0.content')
          },
          {
            title: t?.('roadmap.smart_contract_1.1.label'),
            description: t?.('roadmap.smart_contract_1.1.content')
          },
          {
            title: t?.('roadmap.smart_contract_1.2.label'),
            description: t?.('roadmap.smart_contract_1.2.content')
          },
          {
            title: t?.('roadmap.smart_contract_1.3.label'),
            description: t?.('roadmap.smart_contract_1.3.content')
          },
          {
            title: t?.('roadmap.smart_contract_1.4.label'),
            description: t?.('roadmap.smart_contract_1.4.content')
          },
        ]
      },

      {
        index: 2,
        title: t?.('roadmap.launch'),
        content: [
          {
            title: t?.('roadmap.smart_contract_2.0.label'),
            description: t?.('roadmap.smart_contract_2.0.content')
          },
          {
            title: t?.('roadmap.smart_contract_2.1.label'),
            description: t?.('roadmap.smart_contract_2.1.content')
          },
          {
            title: t?.('roadmap.smart_contract_2.2.label'),
            description: t?.('roadmap.smart_contract_2.2.content')
          },
          {
            title: t?.('roadmap.smart_contract_2.3.label'),
            description: t?.('roadmap.smart_contract_2.3.content')
          },
          {
            title: t?.('roadmap.smart_contract_2.4.label'),
            description: t?.('roadmap.smart_contract_2.4.content')
          },
        ]
      },
      {
        index: 3,
        title: t?.('roadmap.community'),
        content: [
          {
            title: t?.('roadmap.smart_contract_3.0.label'),
            description: t?.('roadmap.smart_contract_3.0.content')
          },
          {
            title: t?.('roadmap.smart_contract_3.1.label'),
            description: t?.('roadmap.smart_contract_3.1.content')
          }
        ]
      }
    ];
    return (
      <RoadMapPhaseStyled theme={theme} container spacing={2}>
        {data.map(o => (
          <Grid className='phase-item' key={o.index} item xs={4} >
            <BoxOutline flexDirection={'column'} p={3} height={'100%'}>
              <Text variant='h2'>{t?.('roadmap.phase')} {o.index}:</Text>
              <Text variant='h6'>{o.title}</Text>
              <List>
                {o.content.map((o, index) => (
                  <ListItem key={index} disablePadding>
                    <Text fontWeight={700}>{o.title} <span style={{ fontWeight: 500 }}>{o.description}</span></Text>
                  </ListItem>
                ))}
              </List>
            </BoxOutline>
          </Grid>
        ))}

      </RoadMapPhaseStyled>
    );
  }
}

const RoadMapPhaseStyled = styled(Grid) <{ theme: Theme }>`
  ${props => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    width: 103%;
    .phase-item {
      max-width: 100%;
    }
  }
`;




export default withTranslation('homepage')(RoadMapPhase);