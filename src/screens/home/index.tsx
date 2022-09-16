import { useEffect, useState } from 'react';
import { Image, FlatList } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"

import logoImg from "../../assets/logo-nlw-esports.png";
import { Background } from '../../components/background';
import { GameCard, IGameCardProps } from '../../components/game-card';
import { Heading } from '../../components/heading';

import { styles } from './styles';

export function Home() {
  const [games, setGames] = useState<IGameCardProps[]>([]);

  const navigate = useNavigation();

  function handleOpenGame({ id, title, bannerUrl }: IGameCardProps) {
    navigate.navigate("game", { id, title, bannerUrl });
  }

  useEffect(() => {
    fetch("http://192.168.1.6:3333/games")
      .then(response => response.json())
      .then(data => setGames(data))
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Image
          source={logoImg}
          style={styles.logo}
        />

        <Heading
          title="Encontre seu duo!"
          subtitle="Selecione o game que deseja jogar..."
        />

        <FlatList
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GameCard
              data={item}
              onPress={() => handleOpenGame(item)}
            />
          )}
          horizontal
          contentContainerStyle={styles.contemList}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    </Background>
  );
}