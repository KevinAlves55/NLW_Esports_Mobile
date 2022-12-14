import { useEffect, useState } from "react"
import { FlatList, Image, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

import logoImg from "../../assets/logo-nlw-esports.png";

import { THEME } from "../../theme";
import { styles } from "./styles";

import { GameParams } from "../../@types/navigation";

import { Heading } from "../../components/heading";
import { Background } from "../../components/background";
import { DuoCard, IDuoCard } from "../../components/duo-card";
import { DuoMatch } from "../../components/duo-match";

export function Game() {

    const route = useRoute();
    const game = route.params as GameParams;
    const navigate = useNavigation();
    const [duoGame, setDuoGame] = useState<IDuoCard[]>([]);
    const [discordDuoSelected, setDiscordDuoSelected] = useState("");

    function handleGoBack() {
        navigate.goBack();
    };

    async function getDiscordUser(adsId: string) {
        fetch(`http://192.168.1.6:3333/ads/${adsId}/discord`)
            .then(response => response.json())
            .then(data => setDiscordDuoSelected(data.discord))
    }

    useEffect(() => {
        fetch(`http://192.168.1.6:3333/games/${game.id}/ads`)
            .then(response => response.json())
            .then(data => setDuoGame(data))
    }, []);

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Entypo
                            name="chevron-thin-left"
                            color={THEME.COLORS.CAPTION_300}
                            size={20}
                        />
                    </TouchableOpacity>

                    <Image
                        source={logoImg}
                        style={styles.logo}
                    />

                    <View style={styles.rigth} />
                </View>

                <Image
                    source={{ uri: game.bannerUrl }}
                    style={styles.cover}
                    resizeMode="cover"
                />

                <Heading
                    title={game.title}
                    subtitle="Conecte-se e comece a jogar!"
                />

                <FlatList
                    data={duoGame}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <DuoCard
                            data={item}
                            key={item.id}
                            onConnect={() => getDiscordUser(item.id)}
                        />
                    )}
                    horizontal
                    style={styles.containerList}
                    contentContainerStyle={
                        [duoGame.length > 0 ? styles.contentList : styles.emptyListContent]
                    }
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyListText}>
                            N??o h?? an??ncios publicados para esse jogo ainda
                        </Text>
                    )}
                />

                <DuoMatch
                    animationType="fade"
                    visible={discordDuoSelected.length > 0}
                    transparent
                    statusBarTranslucent
                    discord={discordDuoSelected}
                    onClose={() => setDiscordDuoSelected("")}
                />
            </SafeAreaView>
        </Background>
    );
}