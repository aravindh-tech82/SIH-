from scapy.all import IP, UDP, Raw
from scapy.layers.isakmp import ISAKMP, ISAKMP_payload_SA, ISAKMP_payload_Proposal, ISAKMP_payload_Transform
from ikev3analytica.utils.logger import logger
import socket
import asyncio

class IKEv1Scanner:
    """IKEv1 Scanning and Enumeration Engine."""
    def __init__(self, target: str, port: int = 500):
        self.target = target
        self.port = port

    def create_sa_packet(self):
        """Creates a basic IKEv1 SA proposal packet."""
        # Define a simple transform: AES-CBC, SHA, DH Group 2
        trans = ISAKMP_payload_Transform(
            transform_count=1,
            transform_id="KEY_IKE",
            transforms=[
                ("Encryption", "AES-CBC"),
                ("KeyLength", 128),
                ("Hash", "SHA"),
                ("GroupDesc", "1024MODPgr"),
                ("LifeType", "Seconds"),
                ("LifeDuration", 28800)
            ]
        )
        
        prop = ISAKMP_payload_Proposal(
            proposal=1,
            proto="ISAKMP",
            trans_nb=1,
            trans=trans
        )
        
        sa = ISAKMP_payload_SA(prop=prop)
        
        import os
        i_cookie = os.urandom(8)
        isakmp = ISAKMP(init_cookie=i_cookie, next_payload="SA", exch_type="identity protection", flags=0) / sa
        return isakmp

    async def scan(self):
        """Performs IKEv1 scan by sending an SA proposal."""
        logger.debug(f"Sending IKEv1 SA proposal to {self.target}:{self.port}")
        
        packet = self.create_sa_packet()
        
        try:
            loop = asyncio.get_event_loop()
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setblocking(False)
            
            # Use connect for easier send/recv on the same address
            sock.connect((self.target, self.port))
            
            await loop.sock_sendall(sock, bytes(packet))
            
            # Wait for response with timeout
            data = await asyncio.wait_for(loop.sock_recv(sock, 4096), timeout=3.0)
            
            if data:
                response = ISAKMP(data)
                logger.debug(f"Received IKEv1 response: {response.summary()}")
                return {
                    "protocol": "IKEv1",
                    "status": "Open",
                    "response": response.summary(),
                    "details": "IKEv1/ISAKMP service detected"
                }
        except (asyncio.TimeoutError, socket.timeout):
            logger.debug(f"IKEv1 scan timeout for {self.target}")
        except ConnectionRefusedError:
            logger.debug(f"IKEv1 connection refused by {self.target}")
        except Exception as e:
            logger.debug(f"IKEv1 scan error: {str(e)}")
        finally:
            if 'sock' in locals():
                sock.close()
        
        return {"protocol": "IKEv1", "status": "Closed/Filtered"}
